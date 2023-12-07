import Task from './Task.js';

class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    }

    addTask(description) {
        const id = description;  // Use description as id
        const isCompleted = false;  // Default value
        const subtasks = [];  // Default value
        const task = new Task(id, description, isCompleted, subtasks);
        console.log(task);
        this.tasks.push(task);
        task.saveToLocalStorage();
        this.saveAllTasks();
        this.renderTask(task);
    }

    saveAllTasks() {
        const taskIds = this.tasks.map(task => task.id);
        localStorage.setItem('tasks', JSON.stringify(taskIds));
    }

    renderTask(task) {
        const taskElement = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `task-${task.id}`;

        const label = document.createElement('label');
        label.htmlFor = `task-${task.id}`;
        label.textContent = task.description;

        const button = document.createElement('button');
        button.classList.add('arrow-btn');

        // Add an event listener to the button
        button.addEventListener('click', () => {
            const rightMenuCard = document.querySelector('.right-menu-card');
            const todoContainer = document.querySelector('.todo-container');
            rightMenuCard.classList.add('expanded');
            todoContainer.classList.add('right-expanded');
        });

        taskElement.appendChild(checkbox);
        taskElement.appendChild(label);
        taskElement.appendChild(button);

        document.querySelector('.todo-list').appendChild(taskElement);
    }
}

export default TaskManager;