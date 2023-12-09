// TaskListUI.js
import DOMHelper from './DOMHelper.js';
import Task from './Task.js'; // Import the Task class

export default class TaskListUI {
    constructor(taskManager, ui) {
        this.taskManager = taskManager;
        this.ui = ui;
        this.domHelper = new DOMHelper();
        this.taskListContainer = this.domHelper.querySelector('.todo-list');
        this.rightMenuCard = this.domHelper.getElementById("right-menu-card");
        this.todoContainer = this.domHelper.querySelector(".todo-container");

        // Cache frequently accessed DOM elements for the right menu card
        this.taskTitle = this.domHelper.querySelector('.task-title');
        this.taskRename = this.domHelper.querySelector('.task-rename');
        this.descriptionBox = this.domHelper.querySelector('.description-box');

        // Initialize the right menu card state
        this.activeTaskId = null;

        // Initialize the right menu card visibility
        this.updateRightMenuCardVisibility();
    }

    // Initialize the TaskListUI, add event listeners, and render tasks
    init() {
        this.addTaskEventListener();
        this.renderTasks();
        this.loadTasksFromLocalStorage();
        this.addTaskListEventListeners(); // Add this line
    }

    // Add event listeners to the task list container
    addTaskListEventListeners() {
        this.taskListContainer.addEventListener('click', event => {
            if (event.target.classList.contains('arrow-btn')) {
                const taskId = event.target.parentElement.getAttribute('data-task');
                const task = this.taskManager.getTask(taskId);
                this.handleArrowButtonClick(event, task);
            } else if (event.target.type === 'checkbox') {
                const taskId = event.target.id.replace('task-', '');
                const task = this.taskManager.getTask(taskId);
                task.completed = event.target.checked;
            }
        });
    }

    // Event listener for adding a new task
    addTaskEventListener() {
        const addTaskBtn = this.domHelper.getElementById('add-task-btn');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => {
                const newTaskInput = this.domHelper.getElementById('new-task-input');
                const taskName = newTaskInput.value;
                if (taskName) {
                    // Create a new Task using the Task class
                    const task = new Task(Date.now(), taskName);
                    this.taskManager.createTask(task); // Add the Task to the TaskManager
                    this.renderTask(task, false); // Add the task to the UI without showing the right menu card
                    newTaskInput.value = ''; // Clear out the input field
                    this.updateRightMenuCardVisibility(); // Update the right menu card visibility
                }
            });
        }
    }

    // Render all tasks
    renderTasks() {
        const tasks = this.taskManager.getTasks();
        let tasksHTML = '';
        tasks.forEach(task => {
            tasksHTML += this.createTaskElement(task);
        });
        this.taskListContainer.innerHTML = tasksHTML;
    }

    // Create HTML string for a task
    createTaskElement(task) {
        return `
            <li data-task="${task.id}">
                <button class="arrow-btn"></button>
                <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
                <label for="task-${task.id}">${task.name}</label>
            </li>
        `;
    }
    // Render a single task
    renderTask(task, updateRightMenu = true) {
        const taskElement = this.createTaskElement(task);
        this.taskListContainer.appendChild(taskElement);
        if (updateRightMenu) {
            this.updateRightMenuCardVisibility();
        }
    }

    


    // Update the right menu card visibility based on the number of tasks
    updateRightMenuCardVisibility() {
        if (this.taskListContainer.children.length === 0) {
            this.rightMenuCard.style.display = 'none';
        } else {
            this.rightMenuCard.style.display = 'block';
        }
    }
  
    
    // Handle the arrow button click event
    handleArrowButtonClick(event, task) {
        event.stopPropagation(); // Prevent checkbox click event from firing
        this.activeTaskId = task.id; // Update the active task ID
        this.rightMenuCard.classList.add('expanded');
        this.rightMenuCard.style.display = 'block';
        this.todoContainer.classList.add('right-expanded');

        // Set the data-task-id attribute of the right menu card to the task id
        this.rightMenuCard.setAttribute('data-task-id', task.id);

        // Set the active task id in local storage
        localStorage.setItem('activeTaskId', task.id);

        // Retrieve and parse the task data from local storage
        const tasks = this.getTasksFromLocalStorage();

        // Find the active task
        const activeTaskId = localStorage.getItem('activeTaskId');
        const activeTask = this.findActiveTask(tasks, activeTaskId);

        // Check if the active task is defined
        if (activeTask) {
            // Update the task fields with the task's name and description
            this.updateTaskFields(activeTask.name, activeTask.description);
        } else {
            console.error(`No task found with id ${activeTaskId}`);
        }
    }

    

    // Retrieve and parse the task data from local storage
    getTasksFromLocalStorage() {
        const tasksJson = localStorage.getItem('tasks');
        return JSON.parse(tasksJson);
    }

    // Find the active task
    findActiveTask(tasks, activeTaskId) {
        return tasks.find(task => task.id === Number(activeTaskId));
    }

    updateTaskFields(taskName, taskDescription) {
        const taskTitle = this.domHelper.querySelector('.task-title');
        const taskRename = this.domHelper.querySelector('.task-rename');
        const descriptionBox = this.domHelper.querySelector('.description-box');
        taskTitle.textContent = `Task: ${taskName}`;
        taskRename.placeholder = taskName;
        taskRename.value = taskName;
        descriptionBox.value = taskDescription || 'Task Description';
    }

    // Create a task's arrow button
    createArrowButton(task) {
        const arrowButton = this.domHelper.createElement('button');
        arrowButton.className = 'arrow-btn';
        arrowButton.addEventListener('click', event => this.handleArrowButtonClick(event, task));
        return arrowButton;
    }

    createCheckbox(task) {
        const checkbox = this.domHelper.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `task-${task.id}`;
        checkbox.checked = task.completed; // Set the initial checked state based on the task's completed status

        // Add an event listener that toggles the 'completed' class on the task element
        checkbox.addEventListener('change', () => {
            const taskElement = this.domHelper.querySelector(`[data-task="${task.id}"]`);
            taskElement.classList.toggle('completed', checkbox.checked);
            task.completed = checkbox.checked; // Update the task's completed status
        });

        return checkbox;
    }

    // Create a task's label
    createLabel(task) {
        const label = this.domHelper.createElement('label');
        label.setAttribute('for', `task-${task.id}`);
        label.textContent = task.name;
        return label;
    }

    loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.forEach(task => {
                // Create a new Task object for each task loaded from local storage
                const loadedTask = new Task(task.id, task.name, task.completed, task.date);
                // Add the loaded task to the TaskManager
                this.taskManager.createTask(loadedTask);
                // Create a task element for the loaded task and append it to the task list
                const taskElement = this.createTaskElement(loadedTask);
                this.taskListContainer.appendChild(taskElement);
                // Update the right menu card visibility after each task is loaded
                this.updateRightMenuCardVisibility();
            });
        } else {
            // If there are no tasks, update the right menu card visibility
            this.updateRightMenuCardVisibility();
        }
    }
}
