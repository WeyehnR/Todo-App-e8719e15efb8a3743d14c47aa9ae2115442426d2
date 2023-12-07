import TaskManager from './TaskManager.js';
import Task from './Task.js';
import DOMHelper from './DOMHelper.js';
import SubTaskManager from './SubTaskManager.js';

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
                const taskDescription = this.domHelper.getElementById('new-task-input').value;
                if (taskDescription) {
                    const task = new Task(taskDescription); // create a new Task
                    this.taskManager.createTask(task); // add the Task to the TaskManager

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

            // Assuming the task has a 'list', 'dueDate', and 'tags' property
            taskDetails.querySelector('#list-select').value = task.list;
            taskDetails.querySelector('#due-date-select').value = task.dueDate;
            taskDetails.querySelector('#tags-select').value = task.tags;

            // Get the subtask list element
            const subtaskList = document.getElementById('subtask-list');

            // Clear the subtask list
            while (subtaskList.firstChild) {
                subtaskList.firstChild.remove();
            }

            // Add each subtask to the subtask list
            task.subtasks.forEach(subtask => {
                const subtaskElement = document.createElement('li');
                subtaskElement.textContent = subtask;
                subtaskList.appendChild(subtaskElement);
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
        // this.loadTasksFromLocalStorage();
        

        this.isInitialized = true;
    }

}