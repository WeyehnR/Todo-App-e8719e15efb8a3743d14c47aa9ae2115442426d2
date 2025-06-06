import TaskManager from './TaskManager.js';
import Task from './Task.js';
import DOMHelper from './DOMHelper.js';
import SubTaskManager from './SubTaskManager.js';

export default class TaskUI {
    constructor(ui,taskManager, domHelper) {
        this.taskManager = taskManager;
        this.domHelper = domHelper;
        this.addTaskButtonClicked = false;
        this.isInitialized = false;
        this.addTaskHandler = null; // add this line
        this.ui
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
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => {
                // Disable the button immediately after it is clicked
                addTaskBtn.disabled = true;

                // console.log('add task button clicked');
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

    addTaskClickEventListener() {
        const tasks = this.domHelper.querySelectorAll('.todo-list li');
        tasks.forEach(task => {
            task.addEventListener('click', () => {
                let taskName = task.querySelector('label').innerText;
                let taskRenameInput = this.domHelper.querySelector('.task-rename');
                taskRenameInput.value = taskName;
                const taskId = task.getAttribute('data-task');

                // Create a new SubTaskManager for the selected task
                const selectedTask = this.taskManager.getTaskById(taskId);
                const subTaskManager = new SubTaskManager(selectedTask, this.domHelper);
                subTaskManager.init();

                // Stop the propagation of the click event on the input and label elements
                const checkbox = task.querySelector('input[type="checkbox"]');
                const label = task.querySelector('label');
                checkbox.addEventListener('click', (event) => event.stopPropagation());
                label.addEventListener('click', (event) => event.stopPropagation());
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

                // If there are no tasks left, close the right menu
                if (this.taskManager.taskCount === 0) {
                    this.closeRightMenu();
                }
            });
        });
        this.checkTaskOverflow();
    }

    bindEventListeners() {
        // Add an event listener to each task
        const tasks = this.domHelper.querySelectorAll('.todo-list li');
        tasks.forEach(task => {
            task.addEventListener('click', () => {
                // Store the task ID when the task is clicked
                this.activeTaskId = task.getAttribute('data-task');
            });
        });

        // Add an event listener to the list dropdown menu
        const listDropdownMenu = this.domHelper.querySelector('#list-select');
        listDropdownMenu.addEventListener('change', (event) => {
                const selectedList = event.target.value;
                // Use the stored task ID
                this.taskManager.updateTaskList(this.activeTaskId, selectedList);
        });

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
        this.bindEventListeners();

        this.isInitialized = true;
    }

}