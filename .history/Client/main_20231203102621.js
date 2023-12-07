import Task from './Task.js';
import TaskManager from './TaskManager.js';
import UI from './UserInterface.js';
import TaskUI from './TaskUI.js';
import DOMHelper from './DOMHelper.js';


const taskUI = new TaskUI(taskManager, new DOMHelper());
const ui = new UI(taskManager, taskUI);
const taskManager = new TaskManager();

try {
    ui.init();
} catch (error) {
    console.error(error);
}