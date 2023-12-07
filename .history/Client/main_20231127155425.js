import Task from './Task.js';
import TaskManager from './TaskManager.js';

const getElementById = (element) => document.getElementById(element);
const querySelector = (element) => document.querySelector(element);

const attachDeleteEventListeners = (taskManager) => {
    document.querySelectorAll('.delete-task-button').forEach(deleteButton => {
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const taskId = deleteButton.getAttribute('data-task-id');
            console.log
            taskManager.deleteTask(taskId);
            deleteButton.parentElement.remove();
            // Clear the current tasks from the UI before rendering
            document.querySelector('.todo-list').innerHTML = '';
            taskManager.renderTasks();
        });
    });
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

    attachDeleteEventListeners(taskManager);
    addTaskEventListener(taskManager);
    addTaskClickEventListener();

    hamburger.addEventListener("click", () => {
        leftMenuCard.classList.toggle("expanded");
        todoContainer.classList.toggle("left-expanded");
        hamburger.classList.toggle("left-expanded");
    });

    const rightArrowButtons = document.querySelectorAll(".arrow-btn");
    rightArrowButtons.forEach(button => {
        button.addEventListener("click", () => {
            rightMenuCard.classList.add("expanded");
            todoContainer.classList.add("right-expanded");
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
});