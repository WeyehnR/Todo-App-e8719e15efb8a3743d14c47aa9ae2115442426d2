import Task from './Task.js';
import TaskManager from './TaskManager.js';
import UI from './UserInterface.js';
import TaskUI from './TaskUI.js';
import DOMHelper from './DOMHelper.js';

const taskManager = new TaskManager();
const taskUI = new TaskUI(taskManager, new DOMHelper());
const ui = new UI(taskManager, taskUI);

try {
    ui.init();
} catch (error) {
    console.error(error);
}