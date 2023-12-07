import Task from './Task.js';

class TaskManager {
    constructor() {
        this.tasks = this.loadTasksFromLocalStorage();
        this.taskCount = 
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

    renderTask(task, taskRenameInput, todoList) {
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

        taskElement.appendChild(checkbox);
        taskElement.appendChild(label);
        taskElement.appendChild(button);

        todoList.appendChild(taskElement);
        taskRenameInput.value = task.description;

        return taskElement;
    }

    renderTasks() {
        const taskRenameInput = document.querySelector('.task-rename');
        const todoList = document.querySelector('.todo-list');
        const rightMenuCard = document.querySelector('.right-menu-card');
        const todoContainer = document.querySelector('.todo-container');

        if (!taskRenameInput || !todoList || !rightMenuCard || !todoContainer) {
            console.error('Required element not found in the DOM');
            return;
        }

        const fragment = document.createDocumentFragment();

        this.tasks.forEach(task => {
            const taskElement = this.renderTask(task, taskRenameInput, todoList);
            fragment.appendChild(taskElement);
        });

        todoList.appendChild(fragment);

        todoList.addEventListener('click', (event) => {
            if (event.target.tagName === 'LI') {
                const taskElement = event.target;
                let taskName = taskElement.querySelector('label').innerText;
                taskRenameInput.value = taskName;

                document.querySelectorAll('.todo-list li').forEach(activeTask => {
                    activeTask.classList.remove('active');
                });

                taskElement.classList.add('active');
                rightMenuCard.classList.add('expanded');
                todoContainer.classList.add('right-expanded');
            }
        });
    }
}

export default TaskManager;