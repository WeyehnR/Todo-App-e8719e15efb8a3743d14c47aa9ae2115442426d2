import Task from './Task.js';
import SubTaskManager from './SubTaskManager.js';
import DOMHelper from './DOMHelper.js';
class TaskManager {
    constructor(ui,tasks = []) {
        this.domHelper = new DOMHelper();
        this.tasks = [];
        this.taskCount = this.tasks.length;
        this.subtaskManagers = {}; // Initialize subtaskManagers
        this.subTaskManagers = {}; // Add this line
        this.ui = ui;

         // Bind the addTask method to this instance
         this.addTask = this.addTask.bind(this);
    }

    setUI(ui) {
        this.ui = ui;
        this.addEventListeners();
    }

    addEventListeners() {
        this.addInputEventListener('.task-rename', this.handleInput);
        this.addDocumentEventListener('DOMContentLoaded', this.handleDOMContentLoaded);
    }

    loadListsFromLocalStorage() {
        const lists = JSON.parse(localStorage.getItem('lists')) || [];
        this.lists = lists;
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
                    if (subtasks.length === 0) {
                        // If subtasksJson is empty, remove it from local storage
                        localStorage.removeItem(`task-${selectedTaskId}-subtasks`);
                    } else {
                        selectedTask._subtasks = subtasks;
                    }
                }

                // Initialize SubTaskManager for the selected task
                this.subTaskManager = new SubTaskManager(selectedTask, new DOMHelper());
                this.subTaskManager.init();

                if (subtasksJson && subtasks.length > 0) {
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
            const newSubtaskManager = new SubTaskManager(task, this.domHelper);
            newSubtaskManager.init();
            
            // Store the SubTaskManager in the subTaskManagers object
            this.subTaskManagers[task._id] = newSubtaskManager; // Add this line
            console.log


            // Save the task to localStorage
            this.saveTaskToLocalStorage(task);

            return task;
        }

        return null; // return null if a task with the same properties already exists
    }

    deleteTask(id) {
        const taskIndex = this.tasks.findIndex(task => task._id === id);
        if (taskIndex > -1) { // Make sure the task was found before trying to delete it
            this.tasks.splice(taskIndex, 1);
            this.taskCount--;

            // If there are no tasks left, remove tasks from local storage
            if (this.tasks.length === 0) {
                localStorage.removeItem('tasks');
                this.ui.closeRightMenu();
            } else {
                // Otherwise, update tasks in local storage
                localStorage.setItem('tasks', JSON.stringify(this.tasks));
            }
        }
    }

    updateTaskList(taskId, selectedList) {
        const task = this.getTaskById(taskId);
        if (task) {
            task._selectedList = selectedList;
            this.saveTaskToLocalStorage(task);
        }
    }

    getTasks() {
        return this.tasks;
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

            // Load subtasks for each task from localStorage
            this.tasks.forEach(task => {
                const subtasksJson = localStorage.getItem(`task-${task._id}-subtasks`);
                if (subtasksJson) {
                    task._subtasks = JSON.parse(subtasksJson);
                }
            });
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
            // localStorage.setItem('selectedTaskId', task._id); // store the ID of the selected task
    
            // Update the task's name in the TaskManager instance
            const taskInManager = this.tasks.find(t => t._id === task._id);
            if (taskInManager) {
                // console.log('Before update:', taskInManager._name); // log the task's name before the update
                taskInManager._name = task._name;
                this.saveTaskToLocalStorage(taskInManager); // update the task in localStorage
                // console.log('After update:', taskInManager._name); // log the task's name after the update
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
            // If there's a previously selected task, save its subtasks to local storage
            if (this.selectedTask) {
                localStorage.setItem(`task-${this.selectedTask._id}-subtasks`, JSON.stringify(this.selectedTask._subtasks));
                // Clear the subtasks from the UI
                this.subTaskManager.clearSubtasks();
            }

            // Update selectedTask
            this.selectedTask = this.getTaskById(task._id);

            // Load subtasks from local storage
            const subtasksJson = localStorage.getItem(`task-${this.selectedTask._id}-subtasks`);
            if (subtasksJson) {
                this.selectedTask._subtasks = JSON.parse(subtasksJson);
            } else {
                // If there are no subtasks in local storage, initialize an empty array
                this.selectedTask._subtasks = [];
            }

            // Retrieve the SubTaskManager for the selected task
            this.subTaskManager = this.subTaskManagers[this.selectedTask._id]; // Change this line

            // Render the subtasks
            this.subTaskManager.renderSubtasks();
        });
    }

    updateSelectedListInTasks(newListName) {
        // Get the tasks from local storage
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        // Update the _selectedList property for each task
        tasks.forEach(task => {
            task._selectedList = newListName;
        });

        // Save the updated tasks back to local storage
        localStorage.setItem('tasks', JSON.stringify(tasks));
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