import Task from './Task.js';
import TaskManager from './TaskManager.js';
import UI from './UserInterface.js';
import TaskUI from './TaskUI.js';
import DOMHelper from './DOMHelper.js';
import SubTaskManager from './SubTaskManager.js';

const domHelper = new DOMHelper();
const ui = new UI(domHelper);

// Load tasks from local storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Initialize TaskManager with the loaded tasks
const taskManager = new TaskManager(tasks);

const taskUI = new TaskUI(taskManager, domHelper);

ui.setTaskManager(taskManager);
taskManager.setUI(ui);

if (!ui.isInitialized) {
    try {
        ui.init();
    } catch (error) {
        console.error(error);
    }
}

if (!taskUI.isInitialized) {
    try {
        taskUI.init();
    } catch (error) {
        console.error(error);
    }
}

// Initialize SubtaskManager for each task
taskManager.tasks.forEach(task => {
    const subtaskManager = new SubTaskManager(task, domHelper);
    if (!subtaskManager.isInitialized) {
        try {
            subtaskManager.init();
        } catch (error) {
            console.error(error);
        }
    }
});