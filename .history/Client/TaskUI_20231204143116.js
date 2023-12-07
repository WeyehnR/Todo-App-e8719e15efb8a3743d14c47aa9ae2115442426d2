import TaskManager from './TaskManager.js';
import Task from './Task.js';
import DOMHelper from './DOMHelper.js';

export default class TaskUI {
    constructor(taskManager, domHelper) {
        this.taskManager = taskManager;
        this.domHelper = domHelper;
        this.addTaskButtonClicked = false;
        this.isInitialized = false;
    }

    getCurrentTaskId() {
        const activeTaskElement = this.domHelper.querySelector('.todo-list li.active');
        return activeTaskElement ? activeTaskElement.getAttribute('data-task') : null;
    }

    updateTaskCount() {
        const taskCountElement = document.querySelector('#today-task-counter');
        if (taskCountElement) {
            taskCountElement.textContent = this.taskManager.taskCount;
        }
    }

    checkTaskOverflow() {
        const todoList = this.domHelper.querySelector('.todo-list');
        if (this.taskManager.tasks.length > 5) {
            todoList.classList.add('overflow');
        } else {
            todoList.classList.remove('overflow');
        }
    }

    addTaskEventListener() {
        const addTaskBtn = this.domHelper.getElementById('add-task-btn');
        if (addTaskBtn && !this.addTaskButtonClicked) {
            addTaskBtn.addEventListener('click', () => {
                const newTaskInput = this.domHelper.getElementById('new-task-input');
                const taskDescription = newTaskInput.value;

                const listSelect = this.domHelper.getElementById('list-select');
                const selectedList = listSelect.options[listSelect.selectedIndex].text;

                const dueDateSelect = this.domHelper.getElementById('due-date-select');
                const selectedDueDate = dueDateSelect.options[dueDateSelect.selectedIndex].text;

                const tagsSelect = this.domHelper.getElementById('tags-select');
                const selectedTags = tagsSelect.options[tagsSelect.selectedIndex].text;

                if (taskDescription) {
                    this.taskManager.addTask(taskDescription, '', selectedList, selectedDueDate, selectedTags);
                    newTaskInput.value = '';
                    this.taskManager.renderTasks();
                    this.attachDeleteEventListeners();
                }
                this.updateTaskCount();
                this.checkTaskOverflow();
            });
            this.addTaskButtonClicked = true;
        }
    }

    addTaskClickEventListener() {
        const tasks = this.domHelper.querySelectorAll('.todo-list li');
        tasks.forEach(task => {
            const arrowBtn = task.querySelector('.arrow-btn');
            if (arrowBtn) {
                arrowBtn.addEventListener('click', () => {
                    const taskRenameInput = this.domHelper.querySelector('.task-rename');
                    taskRenameInput.value = task.querySelector('label').innerText;
                    localStorage.setItem('selectedTaskId', task.getAttribute('data-task'));
                });
            }

            task.addEventListener('click', () => {
                let taskName = task.querySelector('label').innerText;
                let taskRenameInput = this.domHelper.querySelector('.task-rename');
                taskRenameInput.value = taskName;
                task.getAttribute('data-task');
                // this.loadSubtasks(taskId);
            });

            const checkbox = task.querySelector('input[type="checkbox"]');
            const label = task.querySelector('label');
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    label.classList.add('task-completed');
                } else {
                    label.classList.remove('task-completed');
                }
            });
        });
    }

    attachDeleteEventListeners() {
        const buttons = this.domHelper.querySelectorAll('.delete-task-button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const taskId = this.getCurrentTaskId();
                this.taskManager.deleteTask(taskId);
                this.taskManager.renderTasks();
                this.updateTaskCount();
            });
        });
        this.checkTaskOverflow();
    }

    init() {
        if (this.isInitialized) {
            return;
        }

        this.taskManager.renderTasks();
        this.domHelper.getElementById('today-task-counter').textContent = this.taskManager.taskCount;
        this.addTaskEventListener();
        this.attachDeleteEventListeners();
        this.addTaskClickEventListener();

        this.isInitialized = true;
    }

}