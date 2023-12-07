import Task from './Task.js';

class TaskManager {
    constructor() {
        this.tasks = [];
        this.loadTasksFromLocalStorage()
            .then(tasks => this.tasks = tasks)
            .catch(error => console.error(error));
    }

    addTask(description) {
        return new Promise((resolve, reject) => {
            if (description === undefined || description === null) {
                reject('Description must not be undefined or null');
            } else {
                const id = new Date().getTime().toString();  // Use timestamp as id
                const isCompleted = false;  // Default value
                const subtasks = [];  // Default value
                const task = new Task(id, description, isCompleted, subtasks);
                this.tasks.push(task);
                this.saveAllTasks()
                    .then(() => resolve(task))
                    .catch(error => reject(error));
            }
        });
    }

    deleteTask(id) {
        return new Promise((resolve, reject) => {
            const taskIndex = this.tasks.findIndex(task => task.id === id);
            if (taskIndex === -1) {
                reject('Task not found');
            } else {
                this.tasks.splice(taskIndex, 1);
                this.saveAllTasks()
                    .then(() => {
                        const taskElement = document.getElementById(`task-${id}`);
                        if (taskElement) {
                            taskElement.remove();
                        }
                        resolve();
                    })
                    .catch(error => reject(error));
            }
        });
    }

    saveAllTasks() {
        return new Promise((resolve, reject) => {
            try {
                localStorage.setItem('tasks', JSON.stringify(this.tasks));
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    loadTasksFromLocalStorage() {
        return new Promise((resolve, reject) => {
            try {
                const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                resolve(tasks.map(taskObj => new Task(taskObj.id, taskObj.description, taskObj.isCompleted, taskObj.subtasks)));
            } catch (error) {
                reject(error);
            }
        });
    }


    renderTask(task) {
        return new Promise((resolve, reject) => {
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
                reject('task-rename element not found in the DOM');
            } else {
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

                resolve(taskElement);
            }
        });
    }

    renderTasks() {
        return new Promise((resolve, reject) => {
            const promises = this.tasks.map(task => this.renderTask(task));
            Promise.all(promises)
                .then(taskElements => resolve(taskElements))
                .catch(error => reject(error));
        });
    }
   
}

export default TaskManager;