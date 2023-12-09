// Import the necessary classes
import TaskManager from './TASKLISTUI/TaskManager.js';
import TaskUI from './TaskUI.js';
import DomHelper from './TASKLISTUI/DOMHelper.js';
import ListManager from './ListManager.js';
import TagManager from './TagManager.js';
import UI from '../UI/UI.js';
import TaskDetailsUI from './TASKLISTUI/TaskDetails.js';

import TaskListUI from '../TASKLISTUI/TaskListUI.js';

// Create a new DomHelper
const domHelper = new DomHelper();

// Create a new UI
const ui = new UI(domHelper);

// Create a new TaskManager
const taskManager = new TaskManager();
ui.setTaskManager(taskManager);
const taskListUI = new TaskListUI(taskManager, ui);
const taskDetailsUI = new TaskDetailsUI(taskManager, ui);

taskListUI.init();
taskDetailsUI.initEventListeners();
ui.init();


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