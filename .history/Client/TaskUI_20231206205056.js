import TaskManager from './TaskManager.js';
import Task from './Task.js';
import DOMHelper from './DOMHelper.js';
import SubTaskManager from './SubTaskManager.js';
import Subtask from './Subtask.js';

export default class TaskUI {
    constructor(taskManager, domHelper, ui) {
        this.taskManager = taskManager;
        this.domHelper = domHelper;
        this.addTaskButtonClicked = false;
        this.isInitialized = false;
        this.addTaskHandler = null; // add this line
        this.ui = ui;
        this.rightMenuCard = this.domHelper.getElementById("right-menu-card");
        this.todoContainer = this.domHelper.querySelector(".todo-container");

        // Bind 'this' to the addTaskEventListener method
        this.addTaskEventListener = this.addTaskEventListener.bind(this);
    }

    getCurrentTaskId() {
        const activeTaskElement = this.domHelper.querySelector('.todo-list li.active');
        return activeTaskElement ? activeTaskElement.getAttribute('data-task') : null;
    }

    updateTaskCount() {
        const taskCountElement = document.querySelector('#today-task-counter');
        if (taskCountElement) {
            taskCountElement.textContent = this.taskManager.taskCount;
        }
    }

    checkTaskOverflow() {
        const todoList = this.domHelper.querySelector('.todo-list');
        if (this.taskManager.tasks.length > 5) {
            todoList.classList.add('overflow');
        } else {
            todoList.classList.remove('overflow');
        }
    }

    

    addTaskEventListener() {
        const addTaskBtn = this.domHelper.getElementById('add-task-btn');
        if (addTaskBtn) {
            // Remove the existing event listener, if any
            if (this.addTaskHandler) {
                addTaskBtn.removeEventListener('click', this.addTaskHandler);
            }

            // Define the new event listener
            this.addTaskHandler = () => {
                const taskName = this.domHelper.getElementById('new-task-input').value;
                if (taskName) {
                    // Create a new Task with the specified properties
                    const task = {
                        id: Date.now(), // Use the current timestamp as the id
                        name: taskName, // Use the value of the input field as the name
                        description: '',
                        selectedList: 'Select List',
                        selectedDueDate: 'Select Due Date',
                        selectedTags: 'Select Tag',
                        isCompleted: false,
                        subtasks: []
                    };

                    this.taskManager.createTask(task); // Add the Task to the TaskManager

                    // Convert the task to a JSON string
                    const taskJson = JSON.stringify(task);

                    // Save the task to local storage
                    localStorage.setItem(`task-${task.id}`, taskJson);

                    // Add the task to the UI
                    this.addTask(task);
                }
            };

            // Add the new event listener
            addTaskBtn.addEventListener('click', this.addTaskHandler);
        }
    }

    loadTasksFromLocalStorage() {
        // Retrieve tasks from local storage
        for (let i = 0; i < localStorage.length; i++) {
            // Get the key for the current item
            const key = localStorage.key(i);

            // Check if the key starts with 'task-'
            if (key.startsWith('task-')) {
                // Retrieve the task data
                const taskJson = localStorage.getItem(key);

                // Convert the JSON string back into a task object
                const task = JSON.parse(taskJson);

                // Add the task to the TaskManager
                this.taskManager.createTask(task);

                // Add the task to the UI
                this.addTask(task);
            }
        }
    }

    addTaskClickEventListener() {
        const tasks = this.domHelper.querySelectorAll('.todo-list li');
        tasks.forEach(task => {
            task.addEventListener('click', () => {
                const taskId = task.getAttribute('data-task');
                const selectedTask = this.taskManager.getTaskById(taskId); // get the Task from the TaskManager
                const subTaskManager = new SubTaskManager(selectedTask, this.domHelper); // create a new SubTaskManager for the Task
                subTaskManager.init(); // initialize the SubTaskManager
            });
        });
    }


    addTask(task) {
        // Create the task element
        const taskElement = this.createTaskElement(task);

        // Add the event listener to the arrow button
        const arrowButton = taskElement.querySelector('.arrow-btn');
        if (arrowButton && !arrowButton.hasAttribute('listener')) {
            const eventListener = (event) => this.ui.expandRightMenu(event);
            console.log('Adding event listener to:', arrowButton);
            arrowButton.addEventListener('click', eventListener);
            arrowButton.setAttribute('listener', 'true');
        }

        // Get the ul element with the class 'todo-list'
        const todoList = document.querySelector('.todo-list');

        // Add the task element to the DOM
        todoList.appendChild(taskElement);
    }

    createTaskElement(task) {
        // Create a new list item element
        const taskElement = document.createElement('li');
        taskElement.setAttribute('data-task', task.id);

        // Create the checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `task-${task.id}`;
        taskElement.appendChild(checkbox);

        // Create the label
        const label = document.createElement('label');
        label.setAttribute('for', `task-${task.id}`);
        label.textContent = task.name; // Set the text content to the task's name
        taskElement.appendChild(label);

        // Add the arrow button to the task element
        const arrowButton = document.createElement('button');
        arrowButton.className = 'arrow-btn';
        taskElement.appendChild(arrowButton);

        // Add an event listener to the arrow button
        arrowButton.addEventListener('click', () => {
            // Get the task details element
            const taskDetails = document.getElementById('right-menu-card');

            // Update the task details element with the details of the task
            taskDetails.querySelector('.task-title').textContent = `Task: ${task.name}`;
            taskDetails.querySelector('.task-rename').value = task.name;
            taskDetails.querySelector('.task-rename').placeholder = task.name; // Set the placeholder to the task's name
            taskDetails.querySelector('.description-box').value = task.description;

            // Get the select elements
            const listSelect = taskDetails.querySelector('#list-select');
            const dueDateSelect = taskDetails.querySelector('#due-date-select');
            const tagsSelect = taskDetails.querySelector('#tags-select');

            // Set the selected index to the first option
            listSelect.selectedIndex = 0;
            dueDateSelect.selectedIndex = 0;
            tagsSelect.selectedIndex = 0;

            // Get the input field and the "Add Subtask" button
            const inputField = document.getElementById('new-subtask-input');
            const addSubtaskButton = document.getElementById('add-subtask-btn');
            const subtaskList = document.getElementById('subtask-list');

            // Add an event listener to the "Add Subtask" button
            addSubtaskButton.addEventListener('click', () => {

                // Get all task elements
                const taskElements = document.querySelectorAll('[data-task]');

                // Remove the 'active' class from all task elements
                taskElements.forEach((taskElement) => {
                    taskElement.classList.remove('active');
                });

                // Add the 'active' class to the current task element
                taskElement.classList.add('active');
                // Get the value of the input field
                const subtaskName = inputField.value;

                // Check if the input field is not empty
                if (subtaskName) {
                    // Create a new Subtask object with a timestamp as its ID and the input field value as its name
                    const subtask = new Subtask(Date.now(), subtaskName);

                    // Create a new list item for the subtask
                    const subtaskElement = document.createElement('li');

                    // Create a checkbox
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';

                    // Add the checkbox and the subtask name to the list item
                    subtaskElement.appendChild(checkbox);
                    subtaskElement.appendChild(document.createTextNode(subtask.name));

                    // Add the new list item to the subtask list
                    subtaskList.appendChild(subtaskElement);

                    // Save the subtask to local storage
                    let subtasks = JSON.parse(localStorage.getItem('subtasks')) || [];
                    subtasks.push(subtask);
                    localStorage.setItem('subtasks', JSON.stringify(subtasks));

                    // Clear the input field
                    inputField.value = '';
                }
            });

            // Show the task details element
            taskDetails.style.display = 'block';
        });

        return taskElement;
    }

    

    attachDeleteEventListeners() {
        const buttons = this.domHelper.querySelectorAll('.delete-task-button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const currentTaskId = this.getCurrentTaskId(); // Get current task id

                if (currentTaskId) {
                    this.taskManager.deleteTask(currentTaskId);
                    // this.taskManager.renderTasks(); // Re-render tasks in the UI
                    this.updateTaskCount();

                    // If there are no tasks left, remove tasks from local storage
                    if (this.taskManager.tasks.length === 0) {
                        localStorage.removeItem('tasks');
                        this.ui.closeRightMenu();
                    } else {
                        // Otherwise, update tasks in local storage
                        localStorage.setItem('tasks', JSON.stringify(this.taskManager.tasks));
                        this.ui.closeRightMenu();
                    }
                }
            });
        });
        this.checkTaskOverflow();
    }
  

    bindEventListeners() {
        // Add an event listener to each task
        const tasks = this.domHelper.querySelectorAll('.todo-list li');
        tasks.forEach(task => {
            task.addEventListener('click', () => {
                // Store the task ID when the task is clicked
                this.activeTaskId = task.getAttribute('data-task');
            });
        });

        // Add an event listener to the list dropdown menu
        const listDropdownMenu = this.domHelper.querySelector('#list-select');
        listDropdownMenu.addEventListener('change', (event) => {
                const selectedList = event.target.value;
                // Use the stored task ID
                this.taskManager.updateTaskList(this.activeTaskId, selectedList);
        });

    }
    init() {
        if (this.isInitialized) {
            return;
        }

        // this.taskManager.renderTasks();
        this.domHelper.getElementById('today-task-counter').textContent = this.taskManager.taskCount;
        this.addTaskEventListener();
        this.attachDeleteEventListeners();
        this.addTaskClickEventListener();
        this.bindEventListeners();
        this.loadTasksFromLocalStorage();
        

        this.isInitialized = true;
    }

}