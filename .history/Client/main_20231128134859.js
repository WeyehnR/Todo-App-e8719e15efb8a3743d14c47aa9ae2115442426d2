import Task from './Task.js';
import TaskManager from './TaskManager.js';
import UI from 

class UI {
    constructor(taskManager) {
        this.taskManager = taskManager;
        this.taskCount = localStorage.getItem('taskCount') || 0;
        this.hamburger = this.querySelector(".hamburger");
        this.leftMenuCard = this.querySelector(".left-menu-card");
        this.rightMenuCard = this.getElementById("right-menu-card");
        this.todoContainer = this.querySelector(".todo-container");
        this.rightArrowButtons = this.querySelectorAll(".arrow-btn");
    }

    getElementById(element) {
        return document.getElementById(element);
    }

    querySelector(element) {
        return document.querySelector(element);
    }

    querySelectorAll(element) {
        return document.querySelectorAll(element);
    }

    getCurrentTaskId() {
        const activeTaskElement = this.querySelector('.todo-list li.active');
        if (!activeTaskElement) {
            return null;
        }
        const taskId = activeTaskElement.getAttribute('data-task');
        console.log('Task id:', taskId);
        return taskId;
    }

    updateTaskCounter() {
        const taskCounter = this.getElementById('today-task-counter');
        taskCounter.textContent = this.taskManager.tasks.length;
        localStorage.setItem('taskCount', this.taskManager.tasks.length);
        console.log('Task counter:', taskCounter);
    }

    addTaskEventListener() {
        this.getElementById('add-task-btn').addEventListener('click', () => {
            const newTaskInput = this.getElementById('new-task-input');
            const taskDescription = newTaskInput.value;
            if (taskDescription) {
                this.taskManager.addTask(taskDescription);
                newTaskInput.value = '';
                this.querySelector('.todo-list').innerHTML = '';
                this.taskManager.renderTasks();
                this.attachDeleteEventListeners();
            }
            this.updateTaskCounter();
        });
    }

    addTaskClickEventListener() {
        this.querySelectorAll('.todo-list li').forEach(task => {
            task.addEventListener('click', () => {
                let taskName = task.querySelector('label').innerText;
                let taskRenameInput = this.querySelector('.task-rename');
                taskRenameInput.value = taskName;
            });
        });
    }

    attachDeleteEventListeners() {
        this.querySelectorAll('.delete-task-button').forEach(button => {
            button.addEventListener('click', () => {
                const taskId = this.getCurrentTaskId();
                console.log(taskId);
                this.taskManager.deleteTask(taskId);
                this.querySelector('.todo-list').innerHTML = '';
                this.taskManager.renderTasks();
                this.updateTaskCounter();
            });
        });
    }

    updateDayOfMonth() {
        const currentDate = new Date();
        const dayOfMonth = currentDate.getDate();
        const dayOfMonthElement = this.getElementById("dayOfMonth");
        dayOfMonthElement.textContent = dayOfMonth;
    }

    toggleMenu() {
        this.hamburger.addEventListener("click", () => {
            this.leftMenuCard.classList.toggle("expanded");
            this.todoContainer.classList.toggle("left-expanded");
            this.hamburger.classList.toggle("left-expanded");
        });
    }

    setColorOptions() {
        const colorOptions = this.querySelectorAll('.color-option-1, .color-option-2, .color-option-3, .color-option-4, .color-option-5, .color-option-6, .color-option-7, .color-option-8');
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                const color = window.getComputedStyle(option).backgroundColor;
                this.getElementById('dynamic-color-card').style.backgroundColor = color;
            });
        });
    }

    expandRightMenu() {
        this.rightArrowButtons.forEach(button => {
            button.addEventListener("click", () => {
                this.rightMenuCard.classList.add("expanded");
                this.todoContainer.classList.add("right-expanded");
                this.querySelectorAll('.todo-list li').forEach(task => {
                    task.classList.remove('active');
                });
                button.parentElement.classList.add('active');
            });
        });
    }

    resetLocalStorageAndReload() {
        this.getElementById('reset-btn').addEventListener('click', () => {
            localStorage.clear();
            location.reload();
        });
    }

    closeRightMenu() {
        this.querySelector('.close-icon').addEventListener('click', () => {
            this.rightMenuCard.classList.remove('expanded');
            this.todoContainer.classList.remove('right-expanded');
        });
    }

    displayNewListForm() {
        this.getElementById('new-list-form').addEventListener('click', () => {
            this.getElementById('new-list-form').style.display = 'block';
        });
    }

    init() {
        document.addEventListener("DOMContentLoaded", () => {
            this.updateDayOfMonth();
            this.taskManager.renderTasks();
            this.getElementById('today-task-counter').textContent = this.taskCount;
            this.addTaskEventListener();
            this.attachDeleteEventListeners();
            this.addTaskClickEventListener();
            this.toggleMenu();
            this.displayNewListForm();
            this.setColorOptions();
            this.expandRightMenu();
            this.resetLocalStorageAndReload();
            this.closeRightMenu();
        });
    }
}

const taskManager = new TaskManager();
const ui = new UI(taskManager);
ui.init();