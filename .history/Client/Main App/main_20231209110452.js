// main.js
import TaskManager from '../Task/TaskManager.js';
import TaskRenderer from '.';
import TaskSender from './TaskSender.js';
import UI from './UI.js';

// Create instances of the classes
const taskManager = new TaskManager();
const taskRenderer = new TaskRenderer(taskManager);
const taskSender = new TaskSender();
const ui = new UI();

// Set the task manager for the UI
ui.setTaskManager(taskManager);

// Initialize the UI
ui.init();

// Load tasks from local storage and render them
taskManager.loadTasksFromLocalStorage();
taskRenderer.renderTasks();

// Add event listener to 'Add Task' button
const addTaskBtn = document.getElementById('add-task-btn');
const newTaskInput = document.getElementById('new-task-input');

addTaskBtn.addEventListener('click', () => {
    // Disable the 'Add Task' button
    addTaskBtn.disabled = true;

    const taskName = newTaskInput.value;
    if (taskName) {
        // Create a new task and render it
        const task = taskManager.createTask(taskName);
        taskRenderer.renderTasks();

        // Send the new task to the server
        taskSender.sendTaskToServer(task);

        // Clear out the input field
        newTaskInput.value = '';
    }

    // Enable the 'Add Task' button
    addTaskBtn.disabled = false;
});