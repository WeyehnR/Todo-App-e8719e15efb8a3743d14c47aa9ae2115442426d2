import Task from './Task.js';
import TaskManager from './TaskManager.js';

const getElementById = (element) => document.getElementById(element);
const querySelector = (element) => document.querySelector(element);
const querySelectorAll = (element) => document.querySelectorAll(element);

const getCurrentTaskId = () => {
    const activeTaskElement = querySelector('.todo-list li.active');
    if (!activeTaskElement) {
        return null;
    }
    const taskId = activeTaskElement.getAttribute('data-task');
    console.log('Task id:', taskId);
    return taskId;
};

const updateTaskCounter = (taskManager) => {
    const taskCounter = getElementById('today-task-counter');
    taskCounter.textContent = taskManager.tasks.length;
    localStorage.setItem('taskCount', taskManager.tasks.length);
    console.log('Task counter:', taskCounter);
};

const addTaskEventListener = (taskManager) => {
    getElementById('add-task-btn').addEventListener('click', function() {
        const newTaskInput = getElementById('new-task-input');
        const taskDescription = newTaskInput.value;
        if (taskDescription) {
            taskManager.addTask(taskDescription);
            newTaskInput.value = '';
            querySelector('.todo-list').innerHTML = '';
            taskManager.renderTasks();
            attachDeleteEventListeners(taskManager);
        }
        updateTaskCounter(taskManager);
    });
};

const addTaskClickEventListener = () => {
    querySelectorAll('.todo-list li').forEach(task => {
        task.addEventListener('click', function() {
            let taskName = this.querySelector('label').innerText;
            let taskRenameInput = querySelector('.task-rename');
            taskRenameInput.value = taskName;
        });
    });
};

const attachDeleteEventListeners = (taskManager) => {
    querySelectorAll('.delete-task-button').forEach(button => {
        button.addEventListener('click', () => {
            const taskId = getCurrentTaskId();
            console.log(taskId);
            taskManager.deleteTask(taskId);
            querySelector('.todo-list').innerHTML = '';
            taskManager.renderTasks();
            updateTaskCounter(taskManager);
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
    
    const taskCount = localStorage.getItem('taskCount') || 0;
    getElementById('today-task-counter').textContent = taskCount;
    
    addTaskEventListener(taskManager);
    attachDeleteEventListeners(taskManager);
    addTaskClickEventListener();
   
    hamburger.addEventListener("click", () => {
        leftMenuCard.classList.toggle("expanded");
        todoContainer.classList.toggle("left-expanded");
        hamburger.classList.toggle("left-expanded");
    });

    getElementById('new-list-form').addEventListener('click', () => {
        getElementById('new-list-form').style.display = 'block';
    });

    querySelectorAll('.color-button').forEach(button => {
        button.addEventListener('click', (event) => {
            getElementById('dynamic-color-card').style.backgroundColor = event.target.style.backgroundColor;
        });
    });

    const colorOptions = querySelectorAll('.color-option-1, .color-option-2, .color-option-3, .color-option-4, .color-option-5, .color-option-6, .color-option-7, .color-option-8');
    // console.log(colorOptions);

    colorOptions.forEach(option => {
        // console.log(option);
        option.addEventListener('click', function() {
            // console.log('Clicked!');
            const color = window.getComputedStyle(this).backgroundColor;
            // console.log(color);
            getElementById('dynamic-color-card').style.backgroundColor = color;
            // console.log(getElementById('dynamic-color-card').style.backgroundColor);
        });
    });

    const rightArrowButtons = querySelectorAll(".arrow-btn");

    rightArrowButtons.forEach(button => {
        button.addEventListener("click", () => {
            rightMenuCard.classList.add("expanded");
            todoContainer.classList.add("right-expanded");
            querySelectorAll('.todo-list li').forEach(task => {
                task.classList.remove('active');
            });
            button.parentElement.classList.add('active');
        });
    });

    getElementById('reset-btn').addEventListener('click', function() {
        localStorage.clear();
        location.reload();
    });

    querySelector('.close-icon').addEventListener('click', () => {
        rightMenuCard.classList.remove('expanded');
        todoContainer.classList.remove('right-expanded');
    });
});