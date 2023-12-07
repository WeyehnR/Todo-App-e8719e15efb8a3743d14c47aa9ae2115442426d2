// Import the necessary classes
import TaskManager from './TaskManager.js';
import TaskUI from './TaskUI.js';

// Create a new TaskManager
const taskManager = new TaskManager();

// Create a new TaskUI
const taskUI = new TaskUI(taskManager);

// Initialize the TaskUI
taskUI.init();