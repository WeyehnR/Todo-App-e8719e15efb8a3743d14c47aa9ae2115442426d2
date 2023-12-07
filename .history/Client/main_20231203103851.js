import Task from './Task.js';
import TaskManager from './TaskManager.js';
import UI from './UserInterface.js';
import TaskUI from './TaskUI.js';
import DOMHelper from './DOMHelper.js';

const domHelper = new DOMHelper();
const ui = new UI(domHelper);
const taskManager = new TaskManager();

ui.setTaskManager(taskManager, domHelper);
taskManager.setUI(ui);

try {
    ui.init();
} catch (error) {
    console.error(error);
}