// TaskListUI.js
import DOMHelper from './DOMHelper.js';
import Task from './Task.js'; // Import the Task class

export default class TaskListUI {
    constructor(taskManager, ui) {
        this.taskManager = taskManager;
        this.ui = ui;
        this.domHelper = new DOMHelper();
        this.taskListContainer = this.domHelper.querySelector('.todo-list');
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
                    this.renderTask(task); // Add the task to the UI
                    newTaskInput.value = ''; // Clear out the input field
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
    renderTask(task) {
        const taskElement = this.createTaskElement(task);
        this.taskListContainer.appendChild(taskElement);
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

    // Create a task's arrow button
    createArrowButton(task) {
        const arrowButton = this.domHelper.createElement('button');
        arrowButton.className = 'arrow-btn';
        arrowButton.addEventListener('click', event => {
            event.stopPropagation(); // Prevent checkbox click event from firing
            this.ui.expandRightMenu(event);
            localStorage.setItem('activeTaskId', task.id); // Set the active task ID in local storage
        });
        return arrowButton;
    }

    // Create a task's checkbox
    createCheckbox(task) {
        const checkbox = this.domHelper.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `task-${task.id}`;
        return checkbox;
    }

    // Create a task's label
    createLabel(task) {
        const label = this.domHelper.createElement('label');
        label.setAttribute('for', `task-${task.id}`);
        label.textContent = task.name;
        return label;
    }
    
    // Get the ID of the active task
    getActiveTaskId() {
        return localStorage.getItem('activeTaskId');
    }
    

    // Get the active task
    getActiveTask() {
        const activeTaskId = localStorage.getItem('activeTaskId');
        return this.taskManager.getTasks().find((t) => String(t.id) === String(activeTaskId));
    }

    setActiveTask(taskElement, task) {
        const taskElements = document.querySelectorAll('[data-task]');
        taskElements.forEach((taskElement) => {
            taskElement.classList.remove('active');
        });
        taskElement.classList.add('active');

        const activeTaskId = task.id;
        localStorage.setItem('activeTaskId', activeTaskId);
    }

    loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            const taskList = document.querySelector('.todo-list');
            tasks.forEach(task => {
                const taskElement = this.createTaskElement(task);
                taskList.appendChild(taskElement);
            });
        }
    }
}
