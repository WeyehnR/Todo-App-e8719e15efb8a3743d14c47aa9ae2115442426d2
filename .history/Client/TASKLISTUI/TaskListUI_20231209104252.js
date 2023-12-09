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
                    const task = this.createTask(taskName);
                    this.sendTaskToServer(task);
                }

                // Enable the 'Add Task' button
                addTaskBtn.disabled = false;
            });
        }
    }

    createTask(taskName) {
        const task = new Task(Date.now(), taskName);
        this.taskManager.createTask(task); // Add the Task to the TaskManager
        this.renderTasks(); // Render all tasks

        // Convert the tasks array to a JSON string
        const tasksJson = JSON.stringify(this.taskManager.getTasks());

        // Save the JSON string to localStorage
        localStorage.setItem('tasks', tasksJson);

        const newTaskInput = this.domHelper.getElementById('new-task-input');
        newTaskInput.value = ''; // Clear out the input field

        return task;
    }

    sendTaskToServer(task) {
        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        })
        .then(response => response.json())
        .then(task => console.log('Task added:', task))
        .catch(error => console.error(error));
    }

    // Render all tasks
    renderTasks() {
        console.log('Rendering tasks'); // Log a message each time the method is called
        const tasks = this.taskManager.getTasks();
        let html = '';
        tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            html += taskElement.outerHTML;
        });
        this.taskListContainer.innerHTML = html;
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
  
    


    

    // Retrieve and parse the task data from local storage
    getTasksFromLocalStorage() {
        const tasksJson = localStorage.getItem('tasks');
        return JSON.parse(tasksJson);
    }

    // Find the active task
    findActiveTask(tasks, activeTaskId) {
        return tasks.find(task => task.id === Number(activeTaskId));
    }

    

    
}
