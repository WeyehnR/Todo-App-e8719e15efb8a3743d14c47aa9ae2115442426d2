// Import the necessary classes
import TaskManager from './TaskManager.js';
import TaskUI from './TaskUI.js';
import DomHelper from './DOMHelper.js';
import ListManager from './ListManager.js';
import TagManager from './TagManager.js';
import UI from './UI.js';

import TaskListUI from '../';

// Create a new DomHelper
const domHelper = new DomHelper();

// Create a new UI
const ui = new UI(domHelper);

// Create a new TaskManager
const taskManager = new TaskManager();

const taskListUI = new TaskListUI(taskManager, ui);

taskListUI.init();


// // Create a new ListManager
// const listManager = new ListManager(domHelper, ui);

// // Create a new TagManager
// const tagManager = new TagManager(domHelper, ui);

// // Set the TaskManager in the UI
// ui.setTaskManager(taskManager);

// // Create a new TaskUI
// const taskUI = new TaskUI(taskManager, domHelper, ui);

// // Initialize the TaskUI
// taskUI.init();

// listManager.init();

// tagManager.init();

// // Initialize the UI
// ui.init();