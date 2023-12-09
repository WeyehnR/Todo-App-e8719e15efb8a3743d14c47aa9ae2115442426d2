// TaskListUI.js
import DOMHelper from '../DOMHelper/DOMHelper.js'
import Task from '../Task/Task.js'; // Import the Task class

import TaskManager from './TaskManager.js';
import TaskRenderer from './TaskRenderer.js';
import TaskSender from './TaskSender.js';

export default class TaskListUI {
    constructor() {
        t
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
    
}
