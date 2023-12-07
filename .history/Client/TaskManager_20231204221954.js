import Task from './Task.js';
import SubTaskManager from './SubTaskManager.js';
import DOMHelper from './DOMHelper.js';
class TaskManager {
    constructor(tasks = []) {
        this.domHelper = new DOMHelper();
        this.tasks = [];
        this.taskCount = this.tasks.length;
    }

    setUI(ui) {
        this.ui = ui;
        this.addEventListeners();
    }

    addEventListeners() {
        this.addInputEventListener('.task-rename', this.handleInput);
        this.addDocumentEventListener('DOMContentLoaded', this.handleDOMContentLoaded);
    }

    addInputEventListener(selector, handler) {
        const element = document.querySelector(selector);
        if (element) {
            element.removeEventListener('input', handler);
            element.addEventListener('input', handler);
        }
    }

    addDocumentEventListener(event, handler) {
        document.removeEventListener(event, handler);
        document.addEventListener(event, handler);
    }

    handleInput = () => {
        const taskRenameInput = document.querySelector('.task-rename');
        if (taskRenameInput && taskRenameInput.value) {
            this.saveInputValueToLocalStorage('.task-rename', taskRenameInput.value);
        }
    }

    saveInputValueToLocalStorage(key, value) {
        if (key && value) {
            localStorage.setItem(key, value);
            // console.log(`Saved ${key} to localStorage and its value is ${value}`);
        }
    }

    handleDOMContentLoaded = () => {
        this.loadTasksFromLocalStorage();
        this.taskCount = this.tasks.length;
        this.selectTaskFromLocalStorage();
    }

    selectTaskFromLocalStorage() {
        const selectedTaskId = localStorage.getItem('selectedTaskId');
        if (selectedTaskId) {
            const selectedTask = this.tasks.find(task => String(task._id) === selectedTaskId);
            if (selectedTask) {
                this.updateUIWithTaskDetails(selectedTask);

                // Load subtasks from local storage
                const subtasksJson = localStorage.getItem(`task-${selectedTaskId}-subtasks`);
                if (subtasksJson) {
                    const subtasks = JSON.parse(subtasksJson);
                    selectedTask._subtasks = subtasks;
                }

                // Initialize SubTaskManager for the selected task
                this.subTaskManager = new SubTaskManager(selectedTask, new DOMHelper());
                this.subTaskManager.init();

                if (subtasksJson) {
                    this.subTaskManager.renderSubtasks(); // Assuming you have a method to render subtasks
                }
            }
        }
    }

    getSelectedTask()
    {
        return this.selectedTask;
    }

    addTask(name, description = '', selectedList = 'Select List', selectedDueDate = 'Select Due Date', selectedTags = 'Select Tags') {
        const taskExists = this.tasks.some(task => 
            task._name === name && 
            task._description === description && 
            task._selectedList === selectedList && 
            task._selectedDueDate === selectedDueDate && 
            task._selectedTags === selectedTags
        );

        if (!taskExists) {
            const id = new Date().getTime().toString();
            const task = new Task(id, name, description, selectedList, selectedDueDate, selectedTags);
            task._subtasks = []; // add the _subtasks property
            task.renameValue = name; // set renameValue to name

            this.tasks.push(task);
            this.taskCount++;
            this.saveTaskToLocalStorage(task);

            // Create a new SubTaskManager for the new task
            const subtaskManager = new SubTaskManager(task, this.domHelper);
            subtaskManager.init();

            return task;
        }

        return null; // return null if a task with the same properties already exists
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
            this.tasks = this.getTasksFromLocalStorage();
            console.log('Loaded tasks from localStorage', this.tasks);
            this.renderTasks();
            this.updateUIWithSelectedTask();
        } catch (error) {
            console.error('Failed to load tasks from localStorage', error);
        }
    }

    getTaskById(id) {
        return this.tasks.find(task => task._id === id);
    }

    getTasksFromLocalStorage() {
        const tasksData = JSON.parse(localStorage.getItem('tasks')) || [];
        return tasksData.map(taskData => this.createTaskFromData(taskData));
    }

    createTaskFromData(taskData) {
        const task = new Task(taskData._id, taskData._name, taskData._description, taskData._selectedList, taskData._selectedDueDate, taskData._selectedTags);
        task.renameValue = taskData.renameValue;
        return task;
    }

    updateUIWithSelectedTask() {
        const selectedTaskId = localStorage.getItem('selectedTaskId');
        if (selectedTaskId) {
            const selectedTask = this.tasks.find(task => task.id === selectedTaskId);
            if (selectedTask) {
                this.updateUIWithTaskDetails(selectedTask);
            }
        } else {
            this.updateUIWithTaskMatchingRenameValue();
        }
    }

    updateUIWithTaskMatchingRenameValue() {
        const renameValue = localStorage.getItem('taskRenameInput');
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].renameValue === renameValue) {
                this.updateUIWithTaskDetails(this.tasks[i]);
                break;
            }
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
            localStorage.setItem('selectedTaskId', task._id); // store the ID of the selected task
    
            // Update the task's name in the TaskManager instance
            const taskInManager = this.tasks.find(t => t._id === task._id);
            if (taskInManager) {
                // console.log('Before update:', taskInManager._name); // log the task's name before the update
                taskInManager._name = task._name;
                this.saveTaskToLocalStorage(taskInManager); // update the task in localStorage
                console.log('After update:', taskInManager._name); // log the task's name after the update
            }
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
        const todoList = this.getTodoListElement();
        todoList.innerHTML = '';
        this.tasks.forEach((task) => {
            const taskElement = this.renderTask(task);
            todoList.appendChild(taskElement);
            this.addTaskSelectionListener(taskElement, task);
        });
        this.addExpandRightMenuListener(todoList);
        this.updateRenameInputWithSelectedTask();
       
    }

    getTodoListElement() {
        return document.querySelector('.todo-list');
    }

    addTaskSelectionListener(taskElement, task) {
        const arrowBtn = taskElement.querySelector('.arrow-btn');
        arrowBtn.addEventListener('click', () => {
            this.selectedTask = this.getTaskById(task._id);

            // Load subtasks from local storage
            const subtasksJson = localStorage.getItem(`task-${this.selectedTask._id}-subtasks`);
            if (subtasksJson) {
                const subtasks = JSON.parse(subtasksJson);
                this.selectedTask._subtasks = subtasks;
            }

            // Initialize SubTaskManager for the selected task
            this.subTaskManager = new SubTaskManager(this.selectedTask, new DOMHelper());
            this.subTaskManager.init();

            if (subtasksJson) {
                this.subTaskManager.renderSubtasks(); // Assuming you have a method to render subtasks
            }

            // Update the task in the tasks array
            const tasks = this.tasks.map(t => t._id === this.selectedTask._id ? this.selectedTask : t);

            // Save the updated tasks array to local storage
            localStorage.setItem('tasks', JSON.stringify(tasks));

            // Debugging
            console.log('Updated tasks:', tasks);
        });
    }

    cloneAndReplace(element) {
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
        return newElement;
    }

    selectTask(task) {
        console.log('Before update:', task._name); // log the task's name before the update
        this.saveInputValueToLocalStorage('.task-rename', task._name);
        this.updateUIWithTaskDetails(task);
        localStorage.setItem('selectedTaskId', task._id);
        console.log('After update:', task._name); // log the task's name after the update

        // Initialize SubTaskManager for the selected task
        this.subTaskManager = new SubTaskManager(task, new DOMHelper());
        this.subTaskManager.init();
    }

    addExpandRightMenuListener(todoList) {
        if (this.tasks.length > 0 && this.ui && typeof this.ui.expandRightMenu === 'function') {
            todoList.addEventListener('click', this.ui.expandRightMenu.bind(this.ui));
        }
    }

    updateRenameInputWithSelectedTask() {
        const selectedTaskId = localStorage.getItem('selectedTaskId');
        const selectedTask = this.tasks.find(task => String(task._id) === selectedTaskId);
        if (selectedTask) {
            console.log('selectedTask', selectedTask);
            this.saveInputValueToLocalStorage('.task-rename', selectedTask._name);
        } else {
            localStorage.removeItem('taskRenameInput');
        }
    }
   

    updateRenameInputWithSelectedTask() {
        const selectedTaskId = localStorage.getItem('selectedTaskId');
        const selectedTask = this.tasks.find(task => String(task._id) === selectedTaskId);
        this.saveInputValueToLocalStorage('.task-rename', selectedTask ? selectedTask._name : '');
    }

    // TaskManager.js
    loadAllSubtasks() {
        this.tasks.forEach(task => {
            let subTaskManager = new SubTaskManager(task, new DOMHelper());
            subTaskManager.init();
        });
    }
}

export default TaskManager;