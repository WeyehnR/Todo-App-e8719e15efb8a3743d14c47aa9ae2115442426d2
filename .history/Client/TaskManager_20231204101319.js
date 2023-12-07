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
            taskRenameInput.addEventListener('input', () => {
                localStorage.setItem('taskRenameInput', taskRenameInput.value);
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            this.loadTasksFromLocalStorage();
            this.taskCount = this.tasks.length;
        });
    }

    addTask(name, description = '', list = '', dueDate = '', tags) {
        const id = new Date().getTime().toString();
        const task = new Task(id, name, description, list, dueDate, tags);
        this.tasks.push(task);
        this.taskCount++;
        this.saveTaskToLocalStorage(task);
        this.renderTasks();
        return task;
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
                const task = new Task(taskData._id, taskData._name, taskData._description, taskData._list, taskData._dueDate, taskData._tags);
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
        document.querySelector('#list-select').value = task.list;
        document.querySelector('#due-date-select').value = task.dueDate;
        document.querySelector('#tags-select').value = task.tags;
    }

    renderTasks() {
        const todoList = document.querySelector('.todo-list');
        todoList.innerHTML = '';
        this.tasks.forEach(task => {
            const taskElement = this.renderTask(task);
            todoList.appendChild(taskElement);
        });
        if (this.tasks.length > 0) {
            this.ui.expandRightMenu();
        }
    }
}

export default TaskManager;