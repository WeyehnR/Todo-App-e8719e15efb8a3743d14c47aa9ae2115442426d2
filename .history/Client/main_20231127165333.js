import Task from './Task.js';
import TaskManager from './TaskManager.js';

const getElementById = (element) => document.getElementById(element);
const querySelector = (element) => document.querySelector(element);


const getCurrentTaskId = () => {
    // Find the active task element
    const activeTaskElement = document.querySelector('.todo-list li.active');

    // If there's no active task, return null
    if (!activeTaskElement) {
        return null;
    }

    // Get the id from the data-id attribute
    const taskId = activeTaskElement.getAttribute('data-id');

    console.log('Task id:', taskId);  // Log the task id

    // Return the task id
    return taskId;
};


const addTaskEventListener = (taskManager) => {
    getElementById('add-task-btn').addEventListener('click', function() {
        const newTaskInput = getElementById('new-task-input');
        const taskDescription = newTaskInput.value;

        if (taskDescription) {
            taskManager.addTask(taskDescription);
            newTaskInput.value = '';
            // Clear the current tasks from the UI before rendering
            document.querySelector('.todo-list').innerHTML = '';
            taskManager.renderTasks();
            attachDeleteEventListeners(taskManager);
        }
    });
};

const addTaskClickEventListener = () => {
    document.querySelectorAll('.todo-list li').forEach(task => {
        task.addEventListener('click', function() {
            let taskName = this.querySelector('label').innerText;
            let taskRenameInput = document.querySelector('.task-rename');
            taskRenameInput.value = taskName;
        });
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    const dayOfMonthElement = getElementById("dayOfMonth");
    dayOfMonthElement.textContent = dayOfMonth;

    const hamburger = querySelector(".hamburger");
    const leftMenuCard = querySelector(".left-menu-card");
    const rightMenuCard = getElementById("right-menu-card");
    const todoContainer = querySelector(".todo-container");

    const taskManager = new TaskManager();
    taskManager.renderTasks();
   
    addTaskEventListener(taskManager);
    addTaskClickEventListener();

    // Select the delete button
    const deleteButton = document.querySelector('.delete-task-button');

    // Add click event listener to the delete button
    deleteButton.addEventListener('click', () => {
        // Get the id of the current task
        const taskId = getCurrentTaskId();

        console.log(taskId);

        // Delete the task
        taskManager.deleteTask(taskId);

        // Clear the current tasks from the UI before rendering
        document.querySelector('.todo-list').innerHTML = '';
        taskManager.renderTasks();
    });

    hamburger.addEventListener("click", () => {
        leftMenuCard.classList.toggle("expanded");
        todoContainer.classList.toggle("left-expanded");
        hamburger.classList.toggle("left-expanded");
    });

    // Select the arrow buttons
    const rightArrowButtons = document.querySelectorAll(".arrow-btn");

    // Add a click event listener to each arrow button
    rightArrowButtons.forEach(button => {
        button.addEventListener("click", () => {
            rightMenuCard.classList.add("expanded");
            todoContainer.classList.add("right-expanded");

            // Remove the active class from all task elements
            document.querySelectorAll('.todo-list li').forEach(task => {
                task.classList.remove('active');
            });

            // Add the active class to the parent task element of the clicked button
            button.parentElement.classList.add('active');
        });
    });

    document.getElementById('reset-btn').addEventListener('click', function() {
        localStorage.clear();
        location.reload();
    });

    document.querySelector('.close-icon').addEventListener('click', () => {
        rightMenuCard.classList.remove('expanded');
        todoContainer.classList.remove('right-expanded');
    });

    taskManager.renderTasks();
});