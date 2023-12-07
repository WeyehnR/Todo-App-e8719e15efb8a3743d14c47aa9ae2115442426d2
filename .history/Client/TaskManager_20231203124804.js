import Task from './Task.js';

class TaskManager {
    constructor() {
        this.tasks = [];
        this.taskCount = 0;
        // this.loadTasksFromLocalStorage(); 
    }

    setUI(ui) {
        this.ui = ui;
        this.loadTasksFromLocalStorage();
        this.taskCount = this.tasks.length;
    }
    

    addTask(name, description = '', list = '', dueDate = '', tags) {
        const id = new Date().getTime().toString();  // Use timestamp as id
        const task = new Task(id, name, description, list, dueDate, tags);
        this.tasks.push(task);
        this.taskCount++;
        this.saveTaskToLocalStorage(task);  // Save the task to localStorage
        return task;
    }

    deleteTask(id){
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
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(`task-${task.id}`, JSON.stringify(task));
        }
    }

    loadTasksFromLocalStorage() {
        const tasks = [];
        if (typeof localStorage !== 'undefined') {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('task-')) {
                    const taskData = JSON.parse(localStorage.getItem(key));
                    const task = new Task(taskData.id, taskData.name, taskData.description, taskData.list, taskData.dueDate, taskData.tags);
                    tasks.push(task);
                }
            }
        }
        // Sort the tasks by id
        tasks.sort((a, b) => a.id - b.id);

        // Set the tasks
        this.tasks = tasks;

        // Re-render the tasks
    this.renderTasks();
    }

    renderTask(task, taskRenameInput, todoList) {
        const taskElement = document.createElement('li');
        taskElement.setAttribute('data-task', task.id);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `task-${task.id}`;

        const label = document.createElement('label');
        label.htmlFor = `task-${task.id}`;
        label.textContent = task.name;

        const button = document.createElement('button');
        button.classList.add('arrow-btn');

        // Add event listener to the arrow button
        button.addEventListener('click', () => {
            // Get the task name from the label and set it as the value of the task-rename input
            const taskName = button.parentElement.querySelector('label').textContent;
            taskRenameInput.value = taskName;
            // Set the values of the other input fields
            document.querySelector('.description-box').value = task.description;
            document.querySelector('#list-select').value = task.list;
            document.querySelector('#due-date-select').value = task.dueDate;
            document.querySelector('#tags-select').value = task.tags;
        });

        taskElement.appendChild(checkbox);
        taskElement.appendChild(label);
        taskElement.appendChild(button);

        todoList.appendChild(taskElement);

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

        // Clear the previous tasks
        todoList.innerHTML = '';

        const fragment = document.createDocumentFragment();

        this.tasks.forEach(task => {
            const taskElement = this.renderTask(task, taskRenameInput, todoList);
            // Set the task name here
            taskElement.querySelector('label').innerText = task.name;
            fragment.appendChild(taskElement);
        });

        todoList.appendChild(fragment);

        // Add event listeners for the arrow buttons
        todoList.querySelectorAll('.arrow-btn').forEach(button => {
            button.addEventListener('click', () => {
                // Get the task name from the correct label element
                taskRenameInput.value = button.parentElement.querySelector('label').textContent;
            });
        });
        

        // Call expandRightMenu after the tasks are rendered
        this.ui.expandRightMenu();

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