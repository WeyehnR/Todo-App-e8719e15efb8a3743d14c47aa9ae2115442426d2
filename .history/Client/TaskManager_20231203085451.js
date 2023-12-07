import Task from './Task.js';

class TaskManager {
    constructor() {
        this.tasks = this.loadTasksFromLocalStorage();
    }

    addTask(name, description) {
        if (!name || !description) {
            console.error('Name and description must not be undefined or null');
            return;
        }

        const id = new Date().getTime().toString();  // Use timestamp as id
        const task = new Task(id, name, description);
        this.tasks.push(task);
        this.saveAllTasks();
        return task;
    }

    deleteTask(id){
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) {
            console.error('Task not found');
            return false;
        }

        this.tasks.splice(taskIndex, 1);
        this.saveAllTasks();
        return true;
    }

    saveAllTasks() {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        }
    }

    loadTasksFromLocalStorage() {
        if (typeof localStorage !== 'undefined') {
            const tasksData = JSON.parse(localStorage.getItem('tasks')) ?? [];
            return tasksData.map(taskData => new Task(taskData.id, taskData.name, taskData.description, taskData.isCompleted, taskData.subtasks));
        }
        return [];
    }

    renderTask(task) {
        const taskElement = document.createElement('li');
        taskElement.setAttribute('data-task', task.id);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `task-${task.id}`;

        const label = document.createElement('label');
        label.htmlFor = `task-${task.id}`;
        label.textContent = task.description;

        const button = document.createElement('button');
        button.classList.add('arrow-btn');

        const taskRenameInput = document.querySelector('.task-rename');
        if (!taskRenameInput) {
            console.error('task-rename element not found in the DOM');
            return;
        }

        button.addEventListener('click', () => {
            const rightMenuCard = document.querySelector('.right-menu-card');
            const todoContainer = document.querySelector('.todo-container');
            rightMenuCard.classList.add('expanded');
            todoContainer.classList.add('right-expanded');

            document.querySelectorAll('.todo-list li').forEach(activeTask => {
                activeTask.classList.remove('active');
            });

            taskElement.classList.add('active');
        });

        taskElement.addEventListener('click', () => {
            let taskName = taskElement.querySelector('label').innerText;
            let taskRenameInput = document.querySelector('.task-rename');
            taskRenameInput.value = taskName;
        });

        taskElement.appendChild(checkbox);
        taskElement.appendChild(label);
        taskElement.appendChild(button);

        document.querySelector('.todo-list').appendChild(taskElement);
        taskRenameInput.value = task.description;

        return taskElement;
    }

    renderTasks() {
        this.tasks.forEach(task => this.renderTask(task));
    }
}

export default TaskManager;