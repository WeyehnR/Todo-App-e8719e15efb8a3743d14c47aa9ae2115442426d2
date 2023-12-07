// main.js

import TaskManager from './TaskManager.js';
import TaskUI from './TaskUI.js';
import DOMHelper from './DOMHelper.js';

document.addEventListener('DOMContentLoaded', () => {
    // Create a new DOMHelper
    const domHelper = new DOMHelper();

    // Create a new TaskManager
    const taskManager = new TaskManager();

    // Create a new TaskUI
    const taskUI = new TaskUI(taskManager, domHelper);

    // Initialize the TaskUI
    taskUI.init();

    // Load tasks from local storage
    taskManager.loadTasksFromLocalStorage();
});