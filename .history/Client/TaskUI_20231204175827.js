import TaskManager from './TaskManager.js';
import Task from './Task.js';
import DOMHelper from './DOMHelper.js';

export default class TaskUI {
    constructor(taskManager, domHelper) {
        this.taskManager = taskManager;
        this.domHelper = domHelper;
        this.addTaskButtonClicked = false;
        this.isInitialized = false;
        this.addTaskHandler = null; // add this line
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
        if (this.addTaskButtonClicked) {
            return; // if the 'click' event listener has already been added, return
        }

        const addTaskBtn = this.domHelper.getElementById('add-task-btn');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => {
                console.log('add task button clicked');
                const newTaskInput = this.domHelper.getElementById('new-task-input');
                const taskDescription = newTaskInput.value;

                const listSelect = this.domHelper.getElementById('list-select');
                const selectedList = listSelect.options[listSelect.selectedIndex].text;

                const dueDateSelect = this.domHelper.getElementById('due-date-select');
                const selectedDueDate = dueDateSelect.options[dueDateSelect.selectedIndex].text;

                const tagsSelect = this.domHelper.getElementById('tags-select');
                const selectedTags = tagsSelect.options[tagsSelect.selectedIndex].text;

                if (taskDescription) {
                    console.log('Adding task:', taskDescription); // log the task being added
                    this.taskManager.addTask(taskDescription, '', selectedList, selectedDueDate, selectedTags);
                    newTaskInput.value = '';
                    this.taskManager.renderTasks();
                    this.attachDeleteEventListeners();
                }
                this.updateTaskCount();
                this.checkTaskOverflow();
            });

            this.addTaskButtonClicked = true; // set this to true after the 'click' event listener has been added
        }
    }

    addTaskEventListener() {
        const addTaskBtn = this.domHelper.getElementById('add-task-btn');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => {
                // Disable the button immediately after it is clicked
                addTaskBtn.disabled = true;

                console.log('add task button clicked');
                const newTaskInput = this.domHelper.getElementById('new-task-input');
                const taskDescription = newTaskInput.value;

                const listSelect = this.domHelper.getElementById('list-select');
                const selectedList = listSelect.options[listSelect.selectedIndex].text;

                const dueDateSelect = this.domHelper.getElementById('due-date-select');
                const selectedDueDate = dueDateSelect.options[dueDateSelect.selectedIndex].text;

                const tagsSelect = this.domHelper.getElementById('tags-select');
                const selectedTags = tagsSelect.options[tagsSelect.selectedIndex].text;

                if (taskDescription) {
                    console.log('Adding task:', taskDescription); // log the task being added
                    this.taskManager.addTask(taskDescription, '', selectedList, selectedDueDate, selectedTags);
                    newTaskInput.value = '';
                    this.taskManager.renderTasks();
                    this.attachDeleteEventListeners();
                }
                this.updateTaskCount();
                this.checkTaskOverflow();

                // Enable the button again after the task has been added
                addTaskBtn.disabled = false;
            });
        }
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