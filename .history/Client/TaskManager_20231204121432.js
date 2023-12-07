import Task from './Task.js';

class TaskManager {
    constructor() {
        this.tasks = [];
        this.taskCount = 0;
    }

    setUI(ui) {
        this.ui = ui;
        this.addEventListeners();
    }

    addEventListeners() {
        const taskRenameInput = document.querySelector('.task-rename');
        if (taskRenameInput) {
            // Remove any existing event listeners
            taskRenameInput.removeEventListener('input', this.handleInput);
            // Attach the event listener
            taskRenameInput.addEventListener('input', this.handleInput);
        }

        // Remove any existing event listeners
        document.removeEventListener('DOMContentLoaded', this.handleDOMContentLoaded);
        // Attach the event listener
        document.addEventListener('DOMContentLoaded', this.handleDOMContentLoaded);
    }

    handleInput = () => {
        localStorage.setItem('taskRenameInput', taskRenameInput.value);
    }

    handleDOMContentLoaded = () => {
        this.loadTasksFromLocalStorage();
        this.taskCount = this.tasks.length;
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
            this.tasks.push(task);
            this.taskCount++;
            this.saveTaskToLocalStorage(task);
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
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.push(task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (error) {
            console.error('Failed to save task to localStorage', error);
        }
    }

    loadTasksFromLocalStorage() {
        try {
            const tasksData = JSON.parse(localStorage.getItem('tasks')) || [];
            this.tasks = tasksData.map(taskData => {
                const task = new Task(taskData._id, taskData._name, taskData._description, taskData._selectedList, taskData._selectedDueDate, taskData._selectedTags);
                return task;
            });
            this.renderTasks();
        } catch (error) {
            console.error('Failed to load tasks from localStorage', error);
        }
    }

    renderTask(task) {
        const taskElement = document.createElement('li');
        taskElement.setAttribute('data-task', task.id);

        const checkbox = this.createCheckbox(task);
        const label = this.createLabel(task);
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

    createButton(task) {
        const button = document.createElement('button');
        button.classList.add('arrow-btn');
        button.addEventListener('click', () => {
            this.updateUIWithTaskDetails(task);
        });
        return button;
    }

    updateUIWithTaskDetails(task) {
        document.querySelector('.description-box').value = task.description;

        const listSelect = document.querySelector('#list-select');
        listSelect.selectedIndex = 0;

        const dueDateSelect = document.querySelector('#due-date-select');
        dueDateSelect.selectedIndex = 0;

        const tagsSelect = document.querySelector('#tags-select');
        tagsSelect.selectedIndex = 0;
    }

    renderTasks() {
        const todoList = document.querySelector('.todo-list');
        todoList.innerHTML = '';
        this.tasks.forEach(task => {
            const taskElement = this.renderTask(task);
            todoList.appendChild(taskElement);

            const listSelect = taskElement.querySelector('#list-select');
            listSelect.selectedIndex = 0;

            const dueDateSelect = taskElement.querySelector('#due-date-select');
            dueDateSelect.selectedIndex = 0;

            const tagsSelect = taskElement.querySelector('#tags-select');
            tagsSelect.selectedIndex = 0;

            const arrowBtn = taskElement.querySelector('.arrow-btn');
            arrowBtn.addEventListener('click', () => {
                const taskRenameInput = document.querySelector('.task-rename');
                taskRenameInput.value = task.name;

                const descriptionBox = document.querySelector('.description-box');
                descriptionBox.value = task.description;

                const listSelect = document.querySelector('#list-select');
                listSelect.selectedIndex = 0;

                const dueDateSelect = document.querySelector('#due-date-select');
                dueDateSelect.selectedIndex = 0;

                const tagsSelect = document.querySelector('#tags-select');
                tagsSelect.selectedIndex = 0;
            });
        });
        if (this.tasks.length > 0 && this.ui && typeof this.ui.expandRightMenu === 'function') {
            todoList.addEventListener('click', this.ui.expandRightMenu.bind(this.ui));
        }
    }
}

export default TaskManager;