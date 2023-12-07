import Task from './Task.js';

class TaskManager {
    constructor() {
        const taskIds = JSON.parse(localStorage.getItem('tasks')) || [];
        this.tasks = taskIds.map(id => Task.loadFromLocalStorage(id)).filter(task => task !== null);
    }

    addTask(description) {
        if (description === undefined || description === null) {
            console.error('Description must not be undefined or null');
            return;
        }

        const id = new Date().getTime().toString();  // Use timestamp as id
        const isCompleted = false;  // Default value
        const subtasks = [];  // Default value
        const task = new Task(id, description, isCompleted, subtasks);
        console.log(task);
        this.tasks.push(task);
        task.saveToLocalStorage();
        this.saveAllTasks();
        this.renderTask(task);
        return 
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
         // Select the input element and set its value to the task description
        const taskRenameInput = document.querySelector('.task-rename');
        taskRenameInput.value = task.description;
    }
}

export default TaskManager;