import Task from './Task.js';
import TaskManager from './TaskManager.js';
import UI from './UserInterface.js';

const taskManager = new TaskManager();
const ui = new UI(taskManager);

try {
    await ui.init();
} catch (error) {
    console.error(error);
}