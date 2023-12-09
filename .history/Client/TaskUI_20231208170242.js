import TaskManager from './TaskManager.js';
import Task from './TASKLISTUI/Task.js';
import DOMHelper from './TASKLISTUI/DOMHelper.js';
import SubTaskManager from './SubTaskManager.js';
import Subtask from './TASKLISTUI/Subtask.js';

export default class TaskUI {
    constructor(taskManager, domHelper, ui) {
        this.taskManager = taskManager;
        this.domHelper = domHelper;
        this.addTaskButtonClicked = false;
        this.isInitialized = false;
        this.addTaskHandler = null; // add this line
        this.ui = ui;
        this.rightMenuCard = this.domHelper.getElementById("right-menu-card");
        this.todoContainer = this.domHelper.querySelector(".todo-container");
        this.todoList = document.querySelector('.todo-list');
        this.subtaskList = document.getElementById('subtask-list');

        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.activeTask = this.getActiveTask();

        this.descriptionBox = document.getElementsByClassName('description-box')[0];
        this.taskRename = document.getElementsByClassName('task-rename')[0];
        this.dueDateSelect = document.getElementById('due-date-select');
        this.timeSelect = document.getElementById('due-time-select');
        this.listSelect = document.getElementById('list-select');
        this.tagsSelect = document.getElementById('tags-select');
    

        // Bind 'this' to the addTaskEventListener method
        this.addTaskEventListener = this.addTaskEventListener.bind(this);
    }

    checkTaskOverflow() {
        const todoList = this.domHelper.querySelector('.todo-list');
        if (this.taskManager.tasks.length > 5) {
            todoList.classList.add('overflow');
        } else {
            todoList.classList.remove('overflow');
        }
    }
    

    addTaskEventListener() {
        const addTaskBtn = this.domHelper.getElementById('add-task-btn');
        // Get the task counter element
        const taskCounter = this.domHelper.getElementById('today-task-counter');

        if (addTaskBtn) {
            // Remove the existing event listener, if any
            if (this.addTaskHandler) {
                addTaskBtn.removeEventListener('click', this.addTaskHandler);
            }

            // Define the new event listener
            this.addTaskHandler = () => {
                const taskName = this.domHelper.getElementById('new-task-input').value;
                if (taskName) {
                    // Create a new Task with the specified properties
                    const task = {
                        id: Date.now(), // Use the current timestamp as the id
                        name: taskName, // Use the value of the input field as the name
                        description: '',
                        selectedList: 'Select List',
                        selectedDueDate: 'Select Due Date',
                        selectedTags: 'Select Tag',
                        isCompleted: false,
                        subtasks: []
                    };

                    this.taskManager.createTask(task); // Add the Task to the TaskManager
                    
                    // Add the task to the UI
                    this.addTask(task);
                    
                    // Increment the task counter
                    taskCounter.textContent = Number(taskCounter.textContent) + 1;
                }
            };

            // Add the new event listener
            addTaskBtn.addEventListener('click', this.addTaskHandler);
        }
    }

    

    addTaskClickEventListener() {
        const tasks = this.domHelper.querySelectorAll('.todo-list li');
        tasks.forEach(task => {
            task.addEventListener('click', () => {
                const taskId = task.getAttribute('data-task');
                this.taskManager.getTaskById(taskId); // get the Task from the TaskManager
            });
        });
    }


    addTask(task) {
        // Create the task element
        const taskElement = this.createTaskElement(task);

        // Add the task element to the DOM
        this.todoList.appendChild(taskElement);
    }

    createTaskElement(task) {
        const taskElement = this.createTaskListItem(task);
        this.createArrowButton(taskElement, task);
        return taskElement;
    }
    
    createTaskListItem(task) {
        const taskElement = document.createElement('li');
        taskElement.setAttribute('data-task', task.id);
        const checkbox = this.createCheckbox(task);
        const label = this.createLabel(task);
        taskElement.appendChild(checkbox);
        taskElement.appendChild(label);
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
        label.setAttribute('for', `task-${task.id}`);
        label.textContent = task.name;
        return label;
    }
    
    createArrowButton(taskElement, task) {
        const arrowButton = document.createElement('button');
        arrowButton.className = 'arrow-btn';
        taskElement.appendChild(arrowButton);
        this.addArrowButtonEventListener(arrowButton, task, taskElement);
        return arrowButton;
    }
    
    addArrowButtonEventListener(arrowButton, task, taskElement) {
        if (arrowButton && !arrowButton.hasAttribute('listener')) {
            const eventListener = (event) => this.ui.expandRightMenu(event);
            console.log('Adding event listener to:', arrowButton);
            arrowButton.addEventListener('click', eventListener);
            arrowButton.setAttribute('listener', 'true');
        }
        arrowButton.addEventListener('click', () => {
            this.setActiveTask(taskElement, task);
        });
    }

    getActiveTask() {
        const activeTaskId = localStorage.getItem('activeTaskId');
        return this.tasks.find((t) => String(t.id) === String(activeTaskId));
    }

    setActiveTask(taskElement, task) {
        const taskElements = document.querySelectorAll('[data-task]');
        taskElements.forEach((taskElement) => {
            taskElement.classList.remove('active');
        });
        taskElement.classList.add('active');

        const activeTaskElement = document.querySelector('.active');
        const activeTaskId = activeTaskElement.dataset.task;
        localStorage.setItem('activeTaskId', activeTaskId);

        this.updateTaskDetails(task);
        this.loadSubtasksFromLocalStorage();
    }

    updateTaskDetails(task) {
        const taskDetails = document.getElementById('right-menu-card');
        taskDetails.querySelector('.task-title').textContent = `Task: ${task.name}`;
        taskDetails.querySelector('.task-rename').value = task.name;
        taskDetails.querySelector('.task-rename').placeholder = task.name;
        taskDetails.querySelector('.description-box').value = task.description;

        const listSelect = taskDetails.querySelector('#list-select');
        const dueDateSelect = taskDetails.querySelector('#due-date-select');
        const tagsSelect = taskDetails.querySelector('#tags-select');

        listSelect.selectedIndex = 0;
        dueDateSelect.selectedIndex = 0;
        tagsSelect.selectedIndex = 0;

        const subtaskList = document.getElementById('subtask-list');
        subtaskList.innerHTML = '';

        taskDetails.style.display = 'block';
    }
    
    addSubtaskEventListener() {
        const inputField = document.getElementById('new-subtask-input');
        const addSubtaskButton = document.getElementById('add-subtask-btn');

        addSubtaskButton.addEventListener('click', () => {
            const subtaskName = inputField.value;

            if (subtaskName) {
                const subtask = new Subtask(Date.now(), subtaskName);
                this.addSubtaskToDOM(subtask);
                this.updateLocalStorageWithSubtask(subtask);
                inputField.value = '';
            }
        });
    }

    addSubtasksToDOM(subtasks) {
        const fragment = document.createDocumentFragment();

        subtasks.forEach((subtask) => {
            const subtaskElement = this.createSubtaskElement(subtask);
            fragment.appendChild(subtaskElement);
        });

        this.subtaskList.appendChild(fragment);
    }

    createSubtaskElement(subtask) {
        const subtaskElement = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        subtaskElement.appendChild(checkbox);
        subtaskElement.appendChild(document.createTextNode(subtask.name));
        return subtaskElement;
    }

    updateLocalStorageWithSubtask(subtask) {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const activeTaskId = localStorage.getItem('activeTaskId');

        const updatedTasks = tasks.map((t) => {
            if (String(t.id) === String(activeTaskId)) {
                t.subtasks.push(subtask);
            }
            return t;
        });

        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }

    loadTasksFromLocalStorage() {
        const tasksJson = localStorage.getItem('tasks');

        if (tasksJson) {
            const tasks = JSON.parse(tasksJson);

            for (let task of tasks) {
                this.taskManager.createTask(task);
                this.addTask(task);
            }
        }
    }

    loadSubtasksFromLocalStorage() {
        if (this.activeTask) {
            const fragment = document.createDocumentFragment();
            this.activeTask.subtasks.forEach((subtask) => {
                const subtaskElement = this.createSubtaskElement(subtask);
                fragment.appendChild(subtaskElement);
            });

            this.subtaskList.innerHTML = '';
            this.subtaskList.appendChild(fragment);
        }
    }

    addSubtaskToDOM(subtask) {
        const subtaskElement = this.createSubtaskElement(subtask);
        this.subtaskList.appendChild(subtaskElement);
    }

    createSubtaskElement(subtask) {
        const subtaskElement = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        subtaskElement.appendChild(checkbox);
        subtaskElement.appendChild(document.createTextNode(subtask._name));
        return subtaskElement;
    }

        

    // Add this method to your UI class
    bindArrowButtons() {
        const arrowButtons = document.getElementsByClassName('arrow-btn');

        Array.from(arrowButtons).forEach((arrowButton) => {
            arrowButton.addEventListener('click', () => {
                const activeTaskId = arrowButton.parentNode.getAttribute('data-task');
                const tasks = JSON.parse(localStorage.getItem('tasks'));
                const activeTask = tasks.find(task => task.id === Number(activeTaskId));
                this.domHelper.getElementById(`right-menu-card-${activeTaskId}`);

                this.updateFormWithActiveTask(activeTask);
            });
        });
    }

    updateFormWithActiveTask(activeTask) {
        this.descriptionBox.value = activeTask.description;
        this.dueDateSelect.value = activeTask.selectedDueDate;
        this.timeSelect.value = activeTask.selectedTime;
        this.listSelect.value = activeTask.selectedList;
        this.tagsSelect.value = activeTask.selectedTags;
    }


    bindTaskRename() {
        this.taskRename.addEventListener('blur', (event) => {
            const newName = event.target.value;
            const taskTitle = document.getElementsByClassName('task-title')[0];
            taskTitle.textContent = 'Task: ' + newName;

            this.updateTaskProperty('name', newName);

            const activeTaskId = localStorage.getItem('activeTaskId');
            const label = document.querySelector(`label[for="task-${activeTaskId}"]`);
            label.textContent = newName;
        });
    }

    bindDescriptionBox() {
        this.descriptionBox.addEventListener('blur', (event) => {
            const description = event.target.value;
            this.updateTaskProperty('description', description);
        });
    }

    updateTaskProperty(property, value) {
        const activeTaskId = localStorage.getItem('activeTaskId');
        let tasks = JSON.parse(localStorage.getItem('tasks'));
        const activeTask = tasks.find(task => task.id === Number(activeTaskId));
        activeTask[property] = value;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    bindListSelect() {
        this.listSelect.addEventListener('change', (event) => {
            const selectedList = event.target.value;
            this.updateTaskProperty('selectedList', selectedList);
        });
    }

    bindDueDateSelect() {
        this.dueDateSelect.addEventListener('change', (event) => {
            const selectedDueDate = event.target.value;
            this.updateTaskProperty('selectedDueDate', selectedDueDate);
        });
    }


    bindTimeSelect() {
        this.timeSelect.addEventListener('change', (event) => {
            const selectedTime = event.target.value;
            this.updateTaskProperty('selectedTime', selectedTime);
        });
    }

    bindTagsSelect() {
        this.tagsSelect.addEventListener('change', (event) => {
            const selectedTags = event.target.value;
            this.updateTaskProperty('selectedTags', selectedTags);
        });
    }
      

    attachDeleteEventListeners() {
        const buttons = this.domHelper.querySelectorAll('.delete-task-button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const activeTaskId = this.getActiveTaskId();
                if (activeTaskId) {
                    this.deleteTask(activeTaskId);
                }
            });
        });
        this.checkTaskOverflow();
    }

    attachSaveChangesEventListeners() {
        const button = document.querySelector('.save-changes-button');
        button.addEventListener('click', () => {
            const activeTaskId = this.getActiveTaskId();
            if (activeTaskId) {
                this.saveChanges(activeTaskId);
            }
        });
    }

    getActiveTaskId() {
        return localStorage.getItem('activeTaskId');
    }

    deleteTask(activeTaskId) {
        this.taskManager.deleteTask(activeTaskId);
        const activeTaskElement = document.querySelector(`[data-task="${activeTaskId}"]`);
        activeTaskElement.remove();
        localStorage.removeItem('activeTaskId');
        if (this.taskManager.getTasks().length === 0) {
            localStorage.removeItem('tasks');
            this.ui.closeRightMenu();
        } else {
            localStorage.setItem('tasks', JSON.stringify(this.taskManager.getTasks()));
            this.ui.closeRightMenu();
        }
    }

    saveChanges(activeTaskId) {
        const taskDetails = document.getElementById('right-menu-card');
        const taskName = taskDetails.querySelector('.task-rename').value;
        const taskDescription = taskDetails.querySelector('.description-box').value;
        const taskList = taskDetails.querySelector('#list-select').value;
        const taskDueDate = taskDetails.querySelector('#due-date-select').value;
        const taskTime = taskDetails.querySelector('#due-time-select').value;
        const taskTags = taskDetails.querySelector('#tags-select').value;
        const subtaskElements = taskDetails.querySelector('#subtask-list').children;
        const subtasks = Array.from(subtaskElements).map(element => element.textContent);
        const task = this.taskManager.findTaskById(activeTaskId);
        if (!task) {
            return;
        }
        task.name = taskName;
        task.description = taskDescription;
        task.list = taskList;
        task.dueDate = taskDueDate;
        task.time = taskTime;
        task.tags = taskTags;
        task.subtasks = subtasks;
        this.taskManager.updateTask(task);
        localStorage.setItem('tasks', JSON.stringify(this.taskManager.getTasks()));
        const taskElement = document.querySelector(`[data-task="${task.id}"]`);
        const taskLabel = taskElement.querySelector('label');
        taskLabel.textContent = task.name;
    }
  

    bindEventListeners() {
        // Add an event listener to each task
        const tasks = this.domHelper.querySelectorAll('.todo-list li');
        tasks.forEach(task => {
            task.addEventListener('click', () => {
                // Store the task ID when the task is clicked
                const activeTaskId = localStorage.getItem('activeTaskId');
                this.activeTaskId = activeTaskId;
            });
        });

        // Add an event listener to the list dropdown menu
        const listDropdownMenu = this.domHelper.querySelector('#list-select');
        listDropdownMenu.addEventListener('change', (event) => {
                const selectedList = event.target.value;
                // Use the stored task ID
                const activeTaskId = localStorage.getItem('activeTaskId');
                this.taskManager.updateTaskList(activeTaskId, selectedList);
        });

    }
    init() {
        if (this.isInitialized) {
            return;
        }
        this.domHelper.getElementById('today-task-counter').textContent = this.taskManager.taskCount;
        this.loadTasksFromLocalStorage();
        this.addTaskEventListener();
        this.attachDeleteEventListeners();
        this.addTaskClickEventListener();
        this.addSubtaskEventListener();
        this.loadSubtasksFromLocalStorage();
        this.bindListSelect();
        this.bindDueDateSelect();
        this.bindTagsSelect();
        this.bindTimeSelect();
        this.bindDescriptionBox();
        this.bindArrowButtons();
        this.bindTaskRename();
        this.bindEventListeners();
        // this.setDefaultListSelect();
        this.attachSaveChangesEventListeners()
        this.isInitialized = true;
    }

}