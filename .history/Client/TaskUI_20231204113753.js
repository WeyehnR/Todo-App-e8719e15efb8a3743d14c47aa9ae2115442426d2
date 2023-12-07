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
                const selectedList = Array.from(listSelect.selectedOptions)
                    .map(option => option.value === '' ? 'Select List' : option.value);

                const dueDateSelect = this.domHelper.getElementById('due-date-select');
                const selectedDueDate = Array.from(dueDateSelect.selectedOptions)
                    .map(option => option.value === '' ? 'Select Due Date' : new Date(option.value));

                const tagsSelect = this.domHelper.getElementById('tags-select');
                const selectedTags = Array.from(tagsSelect.selectedOptions).map(option => option.value)
                    .map(option => option.value === '' ? 'Select Tags' : option.value));

                if (taskDescription) {
                    this.taskManager.addTask(taskDescription, selectedList, selectedDueDate, selectedTags);
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
            task.addEventListener('click', () => {
                let taskName = this.domHelper.querySelector('label').innerText;
                let taskRenameInput = this.domHelper.querySelector('.task-rename');
                taskRenameInput.value = taskName;
                task.getAttribute('data-task');
                // this.loadSubtasks(taskId);
            });
            const checkbox = this.domHelper.querySelector('input[type="checkbox"]');
            const label = this.domHelper.querySelector('label');
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