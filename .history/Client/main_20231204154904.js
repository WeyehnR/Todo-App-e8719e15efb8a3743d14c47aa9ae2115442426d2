import Task from './Task.js';
import TaskManager from './TaskManager.js';
import SubtaskManager from './SubtaskManager.js';
import UI from './UserInterface.js';
import TaskUI from './TaskUI.js';
import DOMHelper from './DOMHelper.js';

const domHelper = new DOMHelper();
const ui = new UI(domHelper);
const taskManager = new TaskManager();
const taskUI = new TaskUI(taskManager, domHelper);

// Initialize SubtaskManager with the first task
const subtaskManager = new SubtaskManager(taskManager.tasks[0]);

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

// Initialize SubtaskManager
if (!subtaskManager.isInitialized) {
    try {
        subtaskManager.init();
    } catch (error) {
        console.error(error);
    }
}