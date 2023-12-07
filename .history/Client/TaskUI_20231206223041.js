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

                    // Get the tasks array from local storage
                    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

                    // Add the new task to the tasks array
                    tasks.push(task);

                    // Save the tasks array back to local storage
                    localStorage.setItem('tasks', JSON.stringify(tasks));

                    // Add the task to the UI
                    this.addTask(task);
                }
            };

            // Add the new event listener
            addTaskBtn.addEventListener('click', this.addTaskHandler);
        }
    }

    loadTasksFromLocalStorage() {
        // Retrieve the tasks array from local storage
        const tasksJson = localStorage.getItem('tasks');

        // Check if the tasks array is not null
        if (tasksJson) {
            // Convert the JSON string back into a tasks array
            const tasks = JSON.parse(tasksJson);

            // For each task in the tasks array
            for (let task of tasks) {
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
                this.taskManager.getTaskById(taskId); // get the Task from the TaskManager
                // const subTaskManager = new SubTaskManager(selectedTask, this.domHelper); // create a new SubTaskManager for the Task
                // subTaskManager.init(); // initialize the SubTaskManager
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
        const taskElement = createTaskListItem(task);
        const arrowButton = createArrowButton(taskElement, task);
        addArrowButtonEventListener(arrowButton, task);
        return taskElement;
    }
    
    createTaskListItem(task) {
        const taskElement = document.createElement('li');
        taskElement.setAttribute('data-task', task.id);
        const checkbox = createCheckbox(task);
        const label = createLabel(task);
        taskElement.appendChild(checkbox);
        taskElement.appendChild(label);
        return taskElement;
    }
    
    createCheckbox(task) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `task-${task.id}`;
        return checkbox;
    }
    
    createLabel(task) {
    const label = document.createElement('label');
    label.setAttribute('for', `task-${task.id}`);
    label.textContent = task.name;
    return label;
    }
    
    function createArrowButton(taskElement, task) {
    const arrowButton = document.createElement('button');
    arrowButton.className = 'arrow-btn';
    taskElement.appendChild(arrowButton);
    return arrowButton;
    }
    addArrowButtonEventListener(arrowButton, task) {
    arrowButton.addEventListener('click', () => {
        // Rest of your code for handling arrow button click
        // ...
    
    });
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
        this.loadTasksFromLocalStorage();
        this.addTaskEventListener();
        this.attachDeleteEventListeners();
        this.addTaskClickEventListener();
        this.bindEventListeners();
        
        

        this.isInitialized = true;
    }

}