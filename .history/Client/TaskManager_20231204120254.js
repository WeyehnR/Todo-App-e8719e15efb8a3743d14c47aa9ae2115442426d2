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
        document.querySelector('#list-select').value = task.selectedList;
        document.querySelector('#due-date-select').value = task.selectedDueDate;
        document.querySelector('#tags-select').value = task.selectedTags;
    }

    renderTask(task) {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';

        // Create the select elements
        const listSelect = document.createElement('select');
        listSelect.id = `list-select-${task.id}`;
        const defaultOption = document.createElement('option');
        defaultOption.value = 'Select List';
        defaultOption.textContent = 'Select List';
        listSelect.appendChild(defaultOption);
        // Add more options as needed
        taskElement.appendChild(listSelect);

        const dueDateSelect = document.createElement('select');
        dueDateSelect.id = `due-date-select-${task.id}`;
        defaultOption = document.createElement('option');
        defaultOption.value = 'Select Due Date';
        defaultOption.textContent = 'Select Due Date';
        dueDateSelect.appendChild(defaultOption);
        // Add more options as needed
        taskElement.appendChild(dueDateSelect);

        const tagsSelect = document.createElement('select');
        tagsSelect.id = `tags-select-${task.id}`;
        defaultOption = document.createElement('option');
        defaultOption.value = 'Select Tags';
        defaultOption.textContent = 'Select Tags';
        tagsSelect.appendChild(defaultOption);
        // Add more options as needed
        taskElement.appendChild(tagsSelect);

        // Add the rest of the task content

        return taskElement;
    }
}

export default TaskManager;