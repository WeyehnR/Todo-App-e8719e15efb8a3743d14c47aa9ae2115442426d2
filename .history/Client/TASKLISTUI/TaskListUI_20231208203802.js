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
    }

    // Initialize the TaskListUI, add event listeners, and render tasks
    init() {
        this.addTaskEventListener();
        this.renderTasks();
        this.loadTasksFromLocalStorage();
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
                    const task = new Task(Date.now(),taskName);
                    this.taskManager.createTask(task); // Add the Task to the TaskManager
                    this.renderTask(task, false); // Add the task to the UI without showing the right menu card
                    newTaskInput.value = ''; // Clear out the input field

                    // Set the value and the placeholder of the description box to "Task Description"
                    const descriptionBox = this.domHelper.querySelector('.description-box');
                    descriptionBox.value = '';
                    descriptionBox.placeholder = 'Task Description';
                }
            });
        }
    }

    // Render all tasks
    renderTasks() {
        const tasks = this.taskManager.getTasks();
        tasks.forEach(task => {
            this.renderTask(task);
        });
    }

    // Render a single task
    renderTask(task, updateRightMenu = true) {
        const taskElement = this.createTaskElement(task);
        this.taskListContainer.appendChild(taskElement);
        if (updateRightMenu) {
            this.updateRightMenuCardVisibility();
        }
    }

    // Create HTML elements for a task
    createTaskElement(task) {
        const taskElement = this.domHelper.createElement('li');
        taskElement.setAttribute('data-task', task.id);

        // Create and add the arrow button
        const arrowButton = this.createArrowButton(task);
        taskElement.appendChild(arrowButton);

        const checkbox = this.createCheckbox(task);
        const label = this.createLabel(task);
        taskElement.appendChild(checkbox);
        taskElement.appendChild(label);
        return taskElement;
    }


    // Add this method to the TaskListUI class
    updateRightMenuCardVisibility() {
        // Check if there are any tasks
        if (this.taskListContainer.children.length === 0) {
            // If there are no tasks, hide the right menu card
            this.rightMenuCard.style.display = 'none';
        } else {
            // If there are tasks, show the right menu card
            this.rightMenuCard.style.display = 'block';
        }
    }
  
    // Handle the arrow button click event
    handleArrowButtonClick(event, task) {
        event.stopPropagation(); // Prevent checkbox click event from firing
        // Toggle the right menu
        this.rightMenuCard.classList.add('expanded');
        this.rightMenuCard.style.display = 'block';
        this.todoContainer.classList.add('right-expanded');

        // Set the data-task-id attribute of the right menu card to the task id
        this.rightMenuCard.setAttribute('data-task-id', task.id);

        // Get the task list from local storage
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

        // Find the active task in the task list
        const activeTask = tasks.find(t => t.id === task.id);

        // Update the task details in the right menu card
        if (activeTask) {
            this.updateTaskDetails(activeTask);
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

    // Update the task-title and task-rename fields with the task's name
    updateTaskFields(taskName) {
        const taskTitle = this.domHelper.querySelector('.task-title');
        const taskRename = this.domHelper.querySelector('.task-rename');
        taskTitle.textContent = `Task: ${taskName}`;
        taskRename.placeholder = taskName;
        taskRename.value = taskName;
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
