import Task from './Task.js';
import TaskManager from './TaskManager.js';
import UI from './UserInterface.js';
import TaskUI from './TaskUI.js';
import DOMHelper from './DOMHelper.js';
import SubTaskManager from './SubTaskManager.js';

const domHelper = new DOMHelper();
const ui = new UI(domHelper);
const taskManager = new TaskManager();
const taskUI = new TaskUI(taskManager, domHelper);

const subTaskManager = new SubTaskManager();

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