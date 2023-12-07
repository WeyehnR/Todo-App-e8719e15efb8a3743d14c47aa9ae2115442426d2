import Task from './Task.js';
import TaskManager from './TaskManager.js';
import UI from './UserInterface.js';
import TaskUI from './TaskUI.js';
import DOMHelper from './DOMHelper.js';

const domHelper = new DOMHelper();
const ui = new UI(new TaskManager(), new TaskUI(new TaskManager(), domHelper));
const taskManager = new TaskManager(ui);

try {
    ui.init();
} catch (error) {
    console.error(error);
}