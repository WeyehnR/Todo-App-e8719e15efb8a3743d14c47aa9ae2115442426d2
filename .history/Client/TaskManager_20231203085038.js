import Task from './Task.js';

class TaskManager {
    constructor() {
        this.tasks = this.loadTasksFromLocalStorage();
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
        console.log("Adding Task", task);
        console.log(task);
        this.tasks.push(task);

       
        this.saveAllTasks();
        return task;
    }

   

    deleteTask(id){

        console.log('Deleting task with id:', id);  // Log the id of the task to delete

        console.log('Task ids:', this.tasks.map(task => task.id));

        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1)
        {
            console.error('Task not found');
            return;
        }

        this.tasks.splice(taskIndex, 1);

        this.saveAllTasks();

        const taskElement = document.getElementById(`task-${id}`);
        if (taskElement) {
            taskElement.remove();
        }
    }

    saveAllTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
    
  

    loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        return tasks.map(taskObj => new Task(taskObj.id, taskObj.description, taskObj.isCompleted, taskObj.subtasks));
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
    }

    renderTasks() {
            const promises = this.tasks.map(task => this.renderTask(task));
            Promise.all(promises)
                .then(taskElements => resolve(taskElements))
                .catch(error => reject(error));
    }
   
}

export default TaskManager;