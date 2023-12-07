import Task from './Task.js';
import SubTaskManager from './SubTaskManager.js';
import DOMHelper from './DOMHelper.js';
class TaskManager {
    constructor() {
        this.domHelper = new DOMHelper();
        this.tasks = [];
        this.taskCount = 0;
    }

    setUI(ui) {
        this.ui = ui;
        this.addEventListeners();
    }

    addEventListeners() {
        this.addInputEventListener('.task-rename', this.handleInput);
        this.addDocumentEventListener('DOMContentLoaded', this.handleDOMContentLoaded);
    }

    addInputEventListener(selector, handler) {
        const element = document.querySelector(selector);
        if (element) {
            element.removeEventListener('input', handler);
            element.addEventListener('input', handler);
        }
    }

    addDocumentEventListener(event, handler) {
        document.removeEventListener(event, handler);
        document.addEventListener(event, handler);
    }

    handleInput = () => {
        this.saveInputValueToLocalStorage('.task-rename', 'taskRenameInput');
    }

    saveInputValueToLocalStorage(selector, key) {
        const element = document.querySelector(selector);
        localStorage.setItem(key, element.value);
        console.log(`Saved ${key} to localStorage and its value is ${element.value}`);
    }

    handleDOMContentLoaded = () => {
        this.loadTasksFromLocalStorage();
        this.taskCount = this.tasks.length;
        this.selectTaskFromLocalStorage();
    }

    selectTaskFromLocalStorage() {
        const selectedTaskId = localStorage.getItem('selectedTaskId');
        if (selectedTaskId) {
            const selectedTask = this.tasks.find(task => String(task._id) === selectedTaskId);
            if (selectedTask) {
                this.updateUIWithTaskDetails(selectedTask);
            }
        }
    }

    addTask(name, description = '', selectedList = ['Select List'], selectedDueDate = ['Select Due Date'], selectedTags = ['Select Tags']) {
        const taskExists = this.tasks.some(task => 
            task.name === name && 
            task.description === description && 
            task.selectedList.toString() === selectedList.toString() && 
            task.selectedDueDate.toString() === selectedDueDate.toString() && 
            task.selectedTags.toString() === selectedTags.toString()
        );

        if (!taskExists) {
            const id = new Date().getTime().toString();
            const task = new Task(id, name, description, selectedList, selectedDueDate, selectedTags);
            task.renameValue = name; // store the task name in the task object
            this.tasks.push(task);
            this.taskCount++;
            this.saveTaskToLocalStorage(task);

            // Create and initialize a new SubTaskManager for the new task
            const subtaskManager = new SubTaskManager(task, this.domHelper);
            if (!subtaskManager.isInitialized) {
                try {
                    subtaskManager.init();
                } catch (error) {
                    console.error(error);
                }
            }

            return task;
        }
    }

    deleteTask(id) {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) {
            console.error('Task not found');
            return false;
        }
        this.tasks.splice(taskIndex, 1);
        this.taskCount--;
        this.saveAllTasks();
        return true;
    }

    saveTaskToLocalStorage(task) {
        try {
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const existingTaskIndex = tasks.findIndex(t => t._id === task._id);
            if (existingTaskIndex !== -1) {
                // If the task already exists in the tasks array, update it
                tasks[existingTaskIndex] = task;
            } else {
                // If the task doesn't exist in the tasks array, push it
                tasks.push(task);
            }
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (error) {
            console.error('Failed to save task to localStorage', error);
        }
    }

    loadTasksFromLocalStorage() {
        try {
            this.tasks = this.getTasksFromLocalStorage();
            console.log('Loaded tasks from localStorage', this.tasks);
            this.renderTasks();
            this.updateUIWithSelectedTask();
        } catch (error) {
            console.error('Failed to load tasks from localStorage', error);
        }
    }

    getTasksFromLocalStorage() {
        const tasksData = JSON.parse(localStorage.getItem('tasks')) || [];
        return tasksData.map(taskData => this.createTaskFromData(taskData));
    }

    createTaskFromData(taskData) {
        const task = new Task(taskData._id, taskData._name, taskData._description, taskData._selectedList, taskData._selectedDueDate, taskData._selectedTags);
        task.renameValue = taskData.renameValue;
        return task;
    }

    updateUIWithSelectedTask() {
        const selectedTaskId = localStorage.getItem('selectedTaskId');
        if (selectedTaskId) {
            const selectedTask = this.tasks.find(task => task.id === selectedTaskId);
            if (selectedTask) {
                this.updateUIWithTaskDetails(selectedTask);
            }
        } else {
            this.updateUIWithTaskMatchingRenameValue();
        }
    }

    updateUIWithTaskMatchingRenameValue() {
        const renameValue = localStorage.getItem('taskRenameInput');
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].renameValue === renameValue) {
                this.updateUIWithTaskDetails(this.tasks[i]);
                break;
            }
        }
    }

    renderTask(task) {
        const taskElement = document.createElement('li');
        taskElement.setAttribute('data-task', task.id);

        const checkbox = this.createCheckbox(task);
        const label = this.createLabel(task);
        label.textContent = task.renameValue; // use the stored task name
        const button = this.createButton(task);

        taskElement.appendChild(checkbox);
        taskElement.appendChild(label);
        taskElement.appendChild(button);

        return taskElement;
    }

    createCheckbox(task) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `task-${task.id}`;
        return checkbox;
    }

    createLabel(task) {
        const label = document.createElement('label');
        label.htmlFor = `task-${task.id}`;
        label.textContent = task.name;
        return label;
    }

    // In the createButton method
    createButton(task) {
        const button = document.createElement('button');
        button.classList.add('arrow-btn');
        button.addEventListener('click', () => {
            const taskRenameInput = document.querySelector('.task-rename');
            taskRenameInput.value = task._name; // set the value of the rename field to the task name
            this.updateUIWithTaskDetails(task);
            localStorage.setItem('selectedTaskId', task._id); // store the ID of the selected task
        });
        return button;
    }


    updateUIWithTaskDetails(task) {
        const taskRenameInput = document.querySelector('.task-rename');
        taskRenameInput.value = task.renameValue; // update the task-rename input field with the renameValue of the task

        document.querySelector('.description-box').value = task.description;

        const listSelect = document.querySelector('#list-select');
        listSelect.selectedIndex = 0;

        const dueDateSelect = document.querySelector('#due-date-select');
        dueDateSelect.selectedIndex = 0;

        const tagsSelect = document.querySelector('#tags-select');
        tagsSelect.selectedIndex = 0;
    }

    renderTasks() {
        const todoList = this.getTodoListElement();
        todoList.innerHTML = '';
        this.tasks.forEach((task) => {
            const taskElement = this.renderTask(task);
            todoList.appendChild(taskElement);
            this.addTaskSelectionListener(taskElement, task);
        });
        this.addExpandRightMenuListener(todoList);
        this.updateRenameInputWithSelectedTask();
    }

    getTodoListElement() {
        return document.querySelector('.todo-list');
    }

    addTaskSelectionListener(taskElement, task) {
        const arrowBtn = taskElement.querySelector('.arrow-btn');
        const newArrowBtn = this.cloneAndReplace(arrowBtn);
        newArrowBtn.addEventListener('click', () => {
            this.selectTask(task);
        });
    }

    cloneAndReplace(element) {
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
        return newElement;
    }

    selectTask(task) {
        const taskRenameInput = document.querySelector('.task-rename');
        taskRenameInput.value = task._name;
        this.updateUIWithTaskDetails(task);
        localStorage.setItem('selectedTaskId', task._id);
    }

    addExpandRightMenuListener(todoList) {
        if (this.tasks.length > 0 && this.ui && typeof this.ui.expandRightMenu === 'function') {
            todoList.addEventListener('click', this.ui.expandRightMenu.bind(this.ui));
        }
    }

    updateRenameInputWithSelectedTask() {
        const selectedTaskId = localStorage.getItem('selectedTaskId');
        const selectedTask = this.tasks.find(task => String(task._id) === selectedTaskId);
        if (selectedTask) {
            this.saveInputValueToLocalStorage('.task-rename', selectedTask._name);
        } else {
            localStorage.removeItem('taskRenameInput');
        }
    }

    selectTask(task) {
        this.saveInputValueToLocalStorage('.task-rename', task._name);
        this.updateUIWithTaskDetails(task);
        localStorage.setItem('selectedTaskId', task._id);
    }

    updateRenameInputWithSelectedTask() {
        const selectedTaskId = localStorage.getItem('selectedTaskId');
        const selectedTask = this.tasks.find(task => String(task._id) === selectedTaskId);
        this.saveInputValueToLocalStorage('.task-rename', selectedTask ? selectedTask._name : '');
    }
}

export default TaskManager;