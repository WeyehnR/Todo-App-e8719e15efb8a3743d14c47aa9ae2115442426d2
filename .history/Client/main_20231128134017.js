import Task from './Task.js';
import TaskManager from './TaskManager.js';

const getElementById = (element) => document.getElementById(element);
const querySelector = (element) => document.querySelector(element);
const querySelectorAll = (element) => document.querySelectorAll(element);

const hamburger = querySelector(".hamburger");
const leftMenuCard = querySelector(".left-menu-card");
const rightMenuCard = getElementById("right-menu-card");
const todoContainer = querySelector(".todo-container");

const taskManager = new TaskManager();
const taskCount = localStorage.getItem('taskCount') || 0;


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

const updateDayOfMonth = () => {
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    const dayOfMonthElement = getElementById("dayOfMonth");
    dayOfMonthElement.textContent = dayOfMonth;
}

const toggleMenu = () => {
    hamburger.addEventListener("click", () => {
        leftMenuCard.classList.toggle("expanded");
        todoContainer.classList.toggle("left-expanded");
        hamburger.classList.toggle("left-expanded");
    });
}

const setColorOptions = () => {

}


document.addEventListener("DOMContentLoaded", () => {
    updateDayOfMonth();
    taskManager.renderTasks();
   
    getElementById('today-task-counter').textContent = taskCount;
    
    addTaskEventListener(taskManager);
    attachDeleteEventListeners(taskManager);
    addTaskClickEventListener();
   
    toggleMenu();

    getElementById('new-list-form').addEventListener('click', () => {
        getElementById('new-list-form').style.display = 'block';
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