// Import the necessary classes
import TaskManager from './TaskManager.js';
import TaskUI from './TaskUI.js';
import DomHelper from './DOMHelper.js';
import UI from './UI.js';

// Create a new DomHelper
const domHelper = new DomHelper();

// Create a new UI
const ui = new UI(domHelper);

// Create a new TaskManager
const taskManager = new TaskManager();

// Create a new TaskUI
const taskUI = new TaskUI(taskManager, domHelper, ui);

// Initialize the TaskUI
taskUI.init();
UI.init();