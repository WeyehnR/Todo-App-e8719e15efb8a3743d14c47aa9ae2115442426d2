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
const taskDetailsUI = new TaskDetailsUI(taskManager, ui);


const listManager = new ListManager(ui);
const tagManager = new TagManager(ui);
// Set the task manager for the UI
ui.setTaskManager(taskManager);

// Initialize the UI
ui.init();
taskDetailsUI.initEventListeners()
listManager.init();
tagManager.init();


async function checkTimeAndStrikeThrough() {
    const tasks = document.querySelectorAll('li[data-task]');
    for (let task of tasks) {
        const taskId = task.getAttribute('data-task');
        const taskData = await taskManager.getTaskFromServer(taskId);
        if (taskData && taskData.selectedTime) {
            const selectedTime = new Date(taskData.selectedDueDate + ' ' + taskData.selectedTime);
            const currentTime = new Date();
            if (selectedTime < currentTime) {
                const label = task.querySelector('label');
                const timeElement = task.querySelector('.selected-time');
                console.lo
                if (label) {
                    label.style.color = 'red';
                    label.style.textDecoration = 'line-through';
                }
                if (timeElement) {
                    timeElement.style.color = 'red';
                    label.style.textDecoration = 'line-through';
                }
            }
        }
    }
}

// Fetch tasks from the server and render them
async function init() {
    await taskManager.fetchTasksFromServer();
    taskRenderer.renderTasks();
    checkTimeAndStrikeThrough()

    const tasks = document.querySelectorAll('li[data-task]');
    for (let task of tasks) {
        const taskId = task.getAttribute('data-task');
        const taskData = await taskManager.getTaskFromServer(taskId);
        if (taskData && taskData.selectedDueDate) {
            const dueDateElement = document.createElement('p');
            dueDateElement.className = 'due-date';
            dueDateElement.textContent = taskData.selectedDueDate;

            // Insert the due date element after the label
            const label = task.querySelector('label');
            label.parentNode.insertBefore(dueDateElement, label.nextSibling);
        }

        // Handle the time
        if (taskData && taskData.selectedTime) {
            const timeElement = document.createElement('p');
            timeElement.className = 'selected-time';
            timeElement.textContent = taskData.selectedTime;

            // Insert the time element after the due date element
            const dueDateElement = task.querySelector('.due-date');
            dueDateElement.parentNode.insertBefore(timeElement, dueDateElement.nextSibling);
        }
    }
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

