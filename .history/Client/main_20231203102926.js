import Task from './Task.js';
import TaskManager from './TaskManager.js';
import UI from './UserInterface.js';
import TaskUI from './TaskUI.js';
import DOMHelper from './DOMHelper.js';

const domHelper = new DOMHelper();
const ui = new UI(domHelper);
const taskManager = new TaskManager(ui);
const taskUI = new TaskUI(taskManager, domHelper);

ui.setTaskUI(taskUI);
ui.setTaskManager(taskManager);

try {
    ui.init();
} catch (error) {
    console.error(error);
}