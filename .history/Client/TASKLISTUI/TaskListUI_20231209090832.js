// TaskListUI.js
import DOMHelper from '../DOMHelper/DOMHelper.js'
import Task from '../Task/Task.js'; // Import the Task class

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
        // this.updateRightMenuCardVisibility();
    }

    // Initialize the TaskListUI, add event listeners, and render tasks
    init() {
         // Load tasks from localStorage
        this.taskManager.loadTasksFromLocalStorage();
        this.renderTasks();
        this.addTaskEventListener(); // Add this line
    }

    addTaskEventListener() {
        let addTaskBtn = this.domHelper.getElementById('add-task-btn');
        if (addTaskBtn) {
            // Clone the button to remove existing event listeners
            const newAddTaskBtn = addTaskBtn.cloneNode(true);
            addTaskBtn.parentNode.replaceChild(newAddTaskBtn, addTaskBtn);
            addTaskBtn = newAddTaskBtn;

            addTaskBtn.addEventListener('click', () => {
                // Disable the 'Add Task' button
                addTaskBtn.disabled = true;

                const newTaskInput = this.domHelper.getElementById('new-task-input');
                const taskName = newTaskInput.value;
                if (taskName) {
                    // Create a new Task using the Task class
                    const task = new Task(Date.now(), taskName);
                    console.log(task)
                    this.taskManager.createTask(task); // Add the Task to the TaskManager
                    console.log(this.taskManager.getTasks())
                    this.renderTasks(); // Render all tasks
                    newTaskInput.value = ''; // Clear out the input field
                    // Convert the tasks array to a JSON string
                    const tasksJson = JSON.stringify(this.taskManager.getTasks());

                    // Save the JSON string to localStorage
                    localStorage.setItem('tasks', tasksJson);
                    // this.updateRightMenuCardVisibility(); // Update the right menu card visibility
                }

                // Enable the 'Add Task' button
                addTaskBtn.disabled = false;
            });
        }
    }

    // Render all tasks
    renderTasks() {
        console.log('Rendering tasks'); // Log a message each time the method is called
        const tasks = this.taskManager.getTasks();
        const fragment = document.createDocumentFragment();
        tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            fragment.appendChild(taskElement);
        });
        this.taskListContainer.innerHTML = '';
        this.taskListContainer.appendChild(fragment);
    }

    // Create a DOM element for a task
    createTaskElement(task) {
        const li = document.createElement('li');
        li.dataset.task = task.id;

        const arrowBtn = document.createElement('button');
        arrowBtn.className = 'arrow-btn';
        li.appendChild(arrowBtn);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `task-${task.id}`;
        checkbox.checked = task.completed;
        li.appendChild(checkbox);

        const label = document.createElement('label');
        label.htmlFor = `task-${task.id}`;
        label.textContent = task.name;
        li.appendChild(label);

        return li;
    }
    // Render a single task
    renderTask(task, updateRightMenu = true) {
        const taskElement = this.createTaskElement(task);
        // if (updateRightMenu) {
        //     this.updateRightMenuCardVisibility();
        // }
        return taskElement;
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

        // Update the task fields with the task's name and description
        this.updateTaskFields(task.name, task.description);
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
}
