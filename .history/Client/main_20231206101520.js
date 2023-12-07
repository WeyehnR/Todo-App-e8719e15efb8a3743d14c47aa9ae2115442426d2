import Task from './Task.js';
import TaskManager from './TaskManager.js';
import UI from './UserInterface.js';
import TaskUI from './TaskUI.js';
import DOMHelper from './DOMHelper.js';
import SubTaskManager from './SubTaskManager.js';
import Subtask from './Subtask.js';
import ListManager from './ListManager.js'; // Import the ListManager class

const domHelper = new DOMHelper();
const ui = new UI(domHelper);

function loadTasks() {
    // Load tasks from local storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Convert the loaded tasks back into Task objects with their subtasks
    tasks = tasks.map(taskData => {
        const task = new Task(taskData._name, taskData._description, taskData._selectedList, taskData._selectedDueDate, taskData._selectedTags, taskData._isCompleted, taskData._id);
        task._subtasks = taskData._subtasks.map(subtaskData => new Subtask(subtaskData._name, subtaskData._isCompleted, subtaskData._id));
        return task;
    });

    return tasks;
}

// Initialize TaskManager with the loaded tasks
const taskManager = new TaskManager(loadTasks());

const listManager = new ListManager(domHelper, ui);

const tagManager = new TagManager(domHelper, ui); // Create a new instance of TagManager


const taskUI = new TaskUI(taskManager, domHelper);

ui.setTaskManager(taskManager);
taskManager.setUI(ui);

if (!ui.isInitialized) {
    try {
        ui.init();
    } catch (error) {
        console.error('Failed to initialize UI:', error);
    }
}

if (!taskUI.isInitialized) {
    try {
        taskUI.init();
    } catch (error) {
        console.error('Failed to initialize TaskUI:', error);
    }
}

// Initialize the ListManager
listManager.init(); // Add this line
