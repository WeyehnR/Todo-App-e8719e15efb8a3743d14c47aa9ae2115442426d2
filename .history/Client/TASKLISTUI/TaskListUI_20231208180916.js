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

            // Retrieve the task data from local storage
            const tasksJson = localStorage.getItem('tasks');

            // Parse the task data from JSON to an array of task objects
            const tasks = JSON.parse(tasksJson);

            // Find the task with the matching ID
            const activeTaskId = localStorage.getItem('activeTaskId');
            const activeTask = tasks.find(t => t.id === Number(activeTaskId));

            // Update the task-title and task-rename fields with the task's name
            const taskTitle = this.domHelper.querySelector('.task-title');
            const taskRename = this.domHelper.querySelector('.task-rename');
            taskTitle.textContent = `Task: ${activeTask.name}`;
            taskRename.placeholder = activeTask.name;
            taskRename.value = activeTask.name;
        });
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
            });
        }
    }
}
