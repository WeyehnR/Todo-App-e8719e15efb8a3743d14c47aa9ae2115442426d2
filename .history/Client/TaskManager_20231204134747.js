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
        const taskRenameInput = document.querySelector('.task-rename');
        localStorage.setItem('taskRenameInput', taskRenameInput.value); // store the value of the input field in local storage
    }

    handleDOMContentLoaded = () => {
        this.loadTasksFromLocalStorage();
        this.taskCount = this.tasks.length;
        const taskRenameInput = document.querySelector('.task-rename');
        const selectedTaskId = localStorage.getItem('selectedTaskId'); // load the ID of the selected task from local storage
        const selectedTask = this.tasks.find(task => String(task._id) === selectedTaskId); // convert task._id to a string before comparing
        if (selectedTask) {
            taskRenameInput.value = selectedTask._name; // update the rename field with the name of the selected task
        } else {
            taskRenameInput.value = ''; // clear the rename field if no task is selected
        }
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
            task.renameValue = name; // store the task name in the task object
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
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const existingTaskIndex = tasks.findIndex(t => t._id === task._id);
            if (existingTaskIndex !== -1) {
                // If the task already exists in the tasks array, update it
                tasks[existingTaskIndex] = task;
            } else {
                // If the task doesn't exist in the tasks array, push it
                tasks.push(task);
            }
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
                task.renameValue = taskData.renameValue; // load the renameValue property
                return task;
            });
            this.renderTasks();
            const selectedTaskId = localStorage.getItem('selectedTaskId'); // load the ID of the selected task
            if (selectedTaskId) {
                const selectedTask = this.tasks.find(task => task.id === selectedTaskId); // find the selected task
                if (selectedTask) {
                    this.updateUIWithTaskDetails(selectedTask); // update the UI with the details of the selected task
                }
            } else if (this.tasks.length > 0) {
                for (let i = 0; i < this.tasks.length; i++) {
                    if (this.tasks[i].renameValue === localStorage.getItem('taskRenameInput')) {
                        this.updateUIWithTaskDetails(this.tasks[i]);
                        break;
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load tasks from localStorage', error);
        }
    }

    renderTask(task) {
        const taskElement = document.createElement('li');
        taskElement.setAttribute('data-task', task.id);

        const checkbox = this.createCheckbox(task);
        const label = this.createLabel(task);
        label.textContent = task.renameValue; // use the stored task name
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
            const taskRenameInput = document.querySelector('.task-rename');
            taskRenameInput.value = task._name; // set the value of the rename field to the task name
            this.updateUIWithTaskDetails(task);
        });
        return button;
    }

    updateUIWithTaskDetails(task) {
        const taskRenameInput = document.querySelector('.task-rename');
        taskRenameInput.value = task.renameValue; // update the task-rename input field with the renameValue of the task

        document.querySelector('.description-box').value = task.description;

        const listSelect = document.querySelector('#list-select');
        listSelect.selectedIndex = 0;

        const dueDateSelect = document.querySelector('#due-date-select');
        dueDateSelect.selectedIndex = 0;

        const tagsSelect = document.querySelector('#tags-select');
        tagsSelect.selectedIndex = 0;
    }

    renderTasks() {
        const todoList = document.querySelector('.todo-list');
        todoList.innerHTML = '';
        this.tasks.forEach((task) => {
            const taskElement = this.renderTask(task);
            todoList.appendChild(taskElement);

            const arrowBtn = taskElement.querySelector('.arrow-btn');
            // Remove any existing event listeners
            const oldArrowBtn = arrowBtn;
            const newArrowBtn = oldArrowBtn.cloneNode(true);
            oldArrowBtn.parentNode.replaceChild(newArrowBtn, oldArrowBtn);

            newArrowBtn.addEventListener('click', () => {
                const taskRenameInput = document.querySelector('.task-rename');
                taskRenameInput.value = task._name; // set the value of the rename field to the task name
                this.updateUIWithTaskDetails(task);
                localStorage.setItem('selectedTaskId', task.id); // store the ID of the selected task
            });
        });
        if (this.tasks.length > 0 && this.ui && typeof this.ui.expandRightMenu === 'function') {
            todoList.addEventListener('click', this.ui.expandRightMenu.bind(this.ui));
        }
    }
}

export default TaskManager;