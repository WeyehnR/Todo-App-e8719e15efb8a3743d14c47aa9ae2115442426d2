// main.js
import TaskManager from '../Task/TaskManager.js';
import TaskRenderer from '../TASKLISTUI/TaskRenderer.js';
import TaskSender from '../TASKLISTUI/TaskSender.js';
import TaskDetailsUI from '../TASKLISTUI/TaskDetailsUI.js';
import ListManager from '../Lists/ListManager.js';
import TagManager from '../Tag/TagManager.js';
import UI from '../UI/UI.js';

// Create instances of the classes
const taskManager = new TaskManager();
const taskRenderer = new TaskRenderer(taskManager);
const taskSender = new TaskSender();
const ui = new UI();
const taskDetailsUI = new TaskDetailsUI(taskManager, ui, taskSender);


const listManager = new ListManager(ui);
// Set the task manager for the UI
ui.setTaskManager(taskManager);

// Initialize the UI
ui.init();
taskDetailsUI.initEventListeners()
ListManager.init();

// Fetch tasks from the server and render them
async function init() {
    await taskManager.fetchTasksFromServer();
    taskRenderer.renderTasks();
    
}

init();

// Add event listener to 'Add Task' button
const addTaskBtn = document.getElementById('add-task-btn');
const newTaskInput = document.getElementById('new-task-input');

function handleAddTaskClick() {
    // Disable the 'Add Task' button
    addTaskBtn.disabled = true;

    const taskName = newTaskInput.value;
    if (!taskName.trim()) {
        alert('Task name cannot be empty');
        addTaskBtn.disabled = false;
        return;
    }

    // Create a new task and render it
    const task = taskManager.createTask(taskName);
    taskRenderer.renderTasks();

    // Send the new task to the server
    taskSender.sendTaskToServer(task);

    // Clear out the input field
    newTaskInput.value = '';

    // Enable the 'Add Task' button
    addTaskBtn.disabled = false;
}

addTaskBtn.addEventListener('click', handleAddTaskClick);