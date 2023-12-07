import Task from './Task.js';

class TaskManager {
    constructor() {
        this.tasks = [];
        this.taskCount = 0;
        // this.loadTasksFromLocalStorage(); 
    }

    setUI(ui) {
        this.ui = ui;

        // Save the task name to localStorage when it is changed
        const taskRenameInput = document.querySelector('.task-rename');
        if (taskRenameInput) {
            taskRenameInput.addEventListener('input', () => {
                localStorage.setItem('taskRenameInput', taskRenameInput.value);
            });
        }

        // Load the tasks after the DOM is fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.loadTasksFromLocalStorage();
            this.taskCount = this.tasks.length;
        });
    }
    
    updateTaskRenameInLocalStorage(taskId, newTaskRenameInput) {
        if (typeof localStorage !== 'undefined') {
            // Load the task from localStorage
            const taskData = JSON.parse(localStorage.getItem(`task-${taskId}`));

            // Check if taskData is not null
            if (taskData) {
                // Update the taskRenameInput value
                taskData.taskRenameInput = newTaskRenameInput;

                // Save the task back to localStorage
                localStorage.setItem(`task-${taskId}`, JSON.stringify(taskData));
            }
        }
    }

    addTask(name, description = '', list = '', dueDate = '', tags) {
        const id = new Date().getTime().toString();  // Use timestamp as id
        const task = new Task(id, name, description, list, dueDate, tags);
        this.tasks.push(task);
        this.taskCount++;
        this.saveTaskToLocalStorage(task);  // Save the task to localStorage

        // Save the task name to localStorage
        this.updateTaskRenameInLocalStorage(id, name);
        task.taskRenameInput = name; 

        this.renderTasks();  // Render the tasks after adding a task

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
            // Add the taskRenameInput to the task
            task.taskRenameInput = document.querySelector('.task-rename').value;

            // Load the tasks array from localStorage
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

            // Add the task to the tasks array
            tasks.push(task);

            // Save the tasks array to localStorage
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    loadTasksFromLocalStorage() {
        const tasks = [];
        if (typeof localStorage !== 'undefined') {
            // Load the tasks array from localStorage
            const tasksData = JSON.parse(localStorage.getItem('tasks')) || [];

            // Create a Task object for each task data and add it to the tasks array
            tasksData.forEach(taskData => {
                const task = new Task(taskData.id, taskData.name, taskData.description, taskData.list, taskData.dueDate, taskData.tags);
                task.taskRenameInput = taskData.name;  // Set the taskRenameInput to the name of the task data
                tasks.push(task);
            });
        }

        // Set the tasks
        this.tasks = tasks;

        // Load the task name from the last task in the tasks array
        const taskRenameInput = document.querySelector('.task-rename');
        if (taskRenameInput && tasks.length > 0) {
            taskRenameInput.value = tasks[0].taskRenameInput || tasks[0].name;
        }

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

        const button = document.createElement('button');
        button.classList.add('arrow-btn');

        button.addEventListener('click', () => {
            taskRenameInput.value = label.textContent;
            localStorage.setItem('taskRenameInput', label.textContent);
            document.querySelector('.description-box').value = task.description;
            document.querySelector('#list-select').value = task.list;
            document.querySelector('#due-date-select').value = task.dueDate;
            document.querySelector('#tags-select').value = task.tags;
        });

        label.textContent = task.taskRenameInput || task.name;
        label.appendChild(button);  // Append the button to the label after setting the textContent of the label

        taskElement.appendChild(checkbox);
        taskElement.appendChild(label);

        todoList.prepend(taskElement);

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

        // Don't reverse the tasks array before rendering
        this.tasks.forEach(task => {
            const taskElement = this.renderTask(task, taskRenameInput, todoList);
            fragment.appendChild(taskElement);
        });

        todoList.appendChild(fragment);

        const self = this;
        // Add event listeners for the arrow buttons
        todoList.querySelectorAll('.arrow-btn').forEach((button, index) => {
            button.addEventListener('click', () => {
                taskRenameInput.value = self.tasks[index].taskRenameInput || self.tasks[index].name;
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