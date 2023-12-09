// TaskListUI.js
import DOMHelper from '../DOMHelper/DOMHelper.js'
import Task from '../Task/Task.js'; // Import the Task class

import TaskManager from './TaskManager.js';
import TaskRenderer from './TaskRenderer.js';
import TaskSender from './TaskSender.js';

export default class TaskListUI {
    constructor() {
        this.taskManager = new TaskManager();
        this.taskRenderer = new TaskRenderer(this.taskManager);
        this.taskSender = new TaskSender();
    }

    // Initialize the TaskListUI, add event listeners, and render tasks
    init() {
         // Load tasks from localStorage
        this.taskManager.loadTasksFromLocalStorage();
        this.taskRenderer.renderTasks();
        this.addTaskEventListener(); // Add this line
    }

    addTaskEventListener() {
        let addTaskBtn = .getElementById('add-task-btn');
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
        const task = this.taskManager.createTask(taskName);
        this.taskRenderer.renderTasks();
        return task;
    }

    sendTaskToServer(task) {
        this.taskSender.sendTaskToServer(task);
    }
    
}
