import Task from './Task.js';
import TaskManager from './TaskManager.js';
import UI from './UserInterface.js';
import TaskUI from './TaskUI.js';
import DOMHelper from './DOMHelper.js';
import SubTaskManager from './SubTaskManager.js';

const domHelper = new DOMHelper();
const ui = new UI(domHelper);

// Load tasks from local storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Convert the loaded tasks back into Task objects with their subtasks
tasks = tasks.map(taskData => {
    const task = new Task(taskData._name, taskData._description, taskData._selectedList, taskData._selectedDueDate, taskData._selectedTags, taskData._isCompleted, taskData._id);
    task._subtasks = taskData._subtasks.map(subtaskData => new Subtask(subtaskData._name, subtaskData._isCompleted, subtaskData._id));
    return task;
});

// Initialize TaskManager with the loaded tasks
const taskManager = new TaskManager(tasks);

const taskUI = new TaskUI(taskManager, domHelper);

ui.setTaskManager(taskManager);
taskManager.setUI(ui);

if (!ui.isInitialized) {
    try {
        ui.init();
    } catch (error) {
        console.error(error);
    }
}

if (!taskUI.isInitialized) {
    try {
        taskUI.init();
    } catch (error) {
        console.error(error);
    }
}