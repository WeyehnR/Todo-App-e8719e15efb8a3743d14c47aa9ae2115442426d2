import DOMHelper from "../DOMHelper/DOMHelper.js";
import Subtask from "../Subtask/Subtask.js";
import TaskSender from "./TaskSender.js";


export default class TaskDetailsUI {
    constructor(taskManager, ui) {
        this.taskManager = taskManager;
        this.ui = ui;
        this.domHelper = new DOMHelper();
        this.taskSender = new TaskSender();

        this.rightMenuCard = this.domHelper.getElementById("right-menu-card");
        this.todoContainer = this.domHelper.querySelector(".todo-container");

        // Cache frequently accessed DOM elements
        this.taskDetails = this.rightMenuCard;
        this.taskRename = this.domHelper.querySelector('.task-rename');
        this.descriptionBox = this.domHelper.querySelector('.description-box');
        this.dueDateSelect = this.domHelper.querySelector('#due-date-select');
        this.timeSelect = this.domHelper.querySelector('#due-time-select');
        this.listSelect = this.domHelper.querySelector('#list-select');
        this.tagsSelect = this.domHelper.querySelector('#tags-select');
        this.subtaskList = this.domHelper.querySelector('#subtask-list');

        // ...

        // Attach event listeners for task details view
        this.initEventListeners();
    
    }
   

    // Initialize event listeners
    initEventListeners() {
        this.bindTaskRename();
        this.bindListSelect();
        this.bindDescriptionBox();
        this.bindDueDateSelect();
        this.bindTimeSelect();
        this.bindTagsSelect();
        this.closeRightMenu();

        // Event delegation for subtask checkboxes
        this.subtaskList.addEventListener('click', (event) => {
            if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {
                // Handle checkbox click here
            }
        });

        // Close button event listener
        const closeButton = this.domHelper.querySelector('.close-icon');
        closeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            this.closeRightMenu();
        });

        // Delete button event listener
        const deleteButton = this.domHelper.querySelector('.delete-task-button');
        deleteButton.addEventListener('click', () => {
            const activeTaskId = localStorage.getItem('activeTaskId');
            if (activeTaskId) {
                this.deleteTask(activeTaskId);
            }
        });

        // Save button event listener
        const saveButton = this.domHelper.querySelector('.save-changes-button');
        saveButton.addEventListener('click', () => {
            const activeTaskId = localStorage.getItem('activeTaskId');
            if (activeTaskId) {
                this.saveChanges(activeTaskId);
            }
        });

        // Add Subtask button event listener
        const addSubtaskButton = this.domHelper.querySelector('#add-subtask-btn');
        addSubtaskButton.addEventListener('click', () => {
            const subtaskName = this.domHelper.querySelector('#new-subtask-input').value;
            if (subtaskName) {
                const subtask = new Subtask(Date.now(), subtaskName);
                this.addSubtasksToDOM(subtask);
                this.updateLocalStorageWithSubtask(subtask);
                this.domHelper.querySelector('#new-subtask-input').value = '';
            }
        });

        
    }
    closeRightMenu() {
        this.rightMenuCard.classList.remove('expanded');
        this.rightMenuCard.style.display = 'none';
        this.todoContainer.classList.remove('right-expanded');
        this.todoContainer.style.width = 'calc(100% - 5%)';
    }
    
    // Attach event listeners to delete task buttons
    attachDeleteEventListeners() {
        const buttons = this.domHelper.querySelectorAll('.delete-task-button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const activeTaskId = localStorage.getItem('activeTaskId');
                if (activeTaskId) {
                    this.deleteTask(activeTaskId);
                }
            });
        });
        this.checkTaskOverflow();
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
    
    // Attach event listener to save changes button
    attachSaveChangesEventListeners() {
        const button = this.domHelper.querySelector('.save-changes-button');
        button.addEventListener('click', () => {
            const activeTaskId = localStorage.getItem('activeTaskId');
            if (activeTaskId) {
                this.saveChanges(activeTaskId);
            }
        });
    }
    
    // Delete a task by its ID
    deleteTask(activeTaskId) {
        this.taskManager.deleteTask(activeTaskId);
        const activeTaskElement = this.domHelper.querySelector(`[data-task="${activeTaskId}"]`);
        activeTaskElement.remove();
        localStorage.removeItem('activeTaskId');
        if (this.taskManager.getTasks().length === 0) {
            this.closeRightMenu();
        } else {
            this.closeRightMenu();
        }
    }
    
    // Attach event listeners for task rename input field
    bindTaskRename() {
        this.taskRename.addEventListener('blur', (event) => {
            const newName = event.target.value;
            const taskTitle = this.domHelper.querySelector('.task-title');
            taskTitle.textContent = 'Task: ' + newName;
            this.updateTaskProperty('name', newName);

            const activeTaskId = localStorage.getItem('activeTaskId');
            const label = document.querySelector(`label[for="task-${activeTaskId}"]`);
            label.textContent = newName;

            // Send the updated task to the server
            const updatedTask = this.taskManager.findTaskById(activeTaskId);
            if (updatedTask) {
                this.taskSender.updateTaskOnServer(updatedTask);
            } else {
                console.error(`Task with id ${activeTaskId} not found`);
            }
        });
    }
    // Attach event listeners for description box input field
    bindDescriptionBox() {
        this.descriptionBox.addEventListener('blur', (event) => {
            const description = event.target.value;
            this.updateTaskProperty('description', description);

            const activeTaskId = localStorage.getItem('activeTaskId');
            // Send the updated task to the server
            const updatedTask = this.taskManager.findTaskById(activeTaskId);
            if (updatedTask) {
                this.taskSender.updateTaskOnServer(updatedTask);
            } else {
                console.error(`Task with id ${activeTaskId} not found`);
            }
        });
    }
    
    // Attach event listeners for list select input field
    bindListSelect() {
        this.listSelect.addEventListener('change', (event) => {
            const selectedList = event.target.value;
            this.updateTaskProperty('selectedList', selectedList);

            const activeTaskId = localStorage.getItem('activeTaskId');
            // Send the updated task to the server
            const updatedTask = this.taskManager.findTaskById(activeTaskId);
            if (updatedTask) {
                this.taskSender.updateTaskOnServer(updatedTask);
            } else {
                console.error(`Task with id ${activeTaskId} not found`);
            }
        });
    }

    // Attach event listeners for due date select input field
    bindDueDateSelect() {
        this.dueDateSelect.addEventListener('change', (event) => {
            const selectedDueDate = event.target.value;
            this.updateTaskProperty('selectedDueDate', selectedDueDate);

            const activeTaskId = localStorage.getItem('activeTaskId');
            // Send the updated task to the server
            const updatedTask = this.taskManager.findTaskById(activeTaskId);
            if (updatedTask) {
                this.taskSender.updateTaskOnServer(updatedTask);
            } else {
                console.error(`Task with id ${activeTaskId} not found`);
            }
        });
    }
    
    // Attach event listeners for time select input field
    bindTimeSelect() {
        this.timeSelect.addEventListener('change', (event) => {
            const selectedTime = event.target.value;
            this.updateTaskProperty('selectedTime', selectedTime);

            const activeTaskId = localStorage.getItem('activeTaskId');
            // Send the updated task to the server
            const updatedTask = this.taskManager.findTaskById(activeTaskId);
            if (updatedTask) {
                this.taskSender.updateTaskOnServer(updatedTask);
            } else {
                console.error(`Task with id ${activeTaskId} not found`);
            }
        });
    }

    // Attach event listeners for tags select input field
    bindTagsSelect() {
        this.tagsSelect.addEventListener('change', (event) => {
            const selectedTags = event.target.value;
            this.updateTaskProperty('selectedTags', selectedTags);

            const activeTaskId = localStorage.getItem('activeTaskId');
            // Send the updated task to the server
            const updatedTask = this.taskManager.findTaskById(activeTaskId);
            if (updatedTask) {
                this.taskSender.updateTaskOnServer(updatedTask);
            } else {
                console.error(`Task with id ${activeTaskId} not found`);
            }
        });
    }
    
    // Update a task property in local storage
    updateTaskProperty(property, value) {
        const activeTaskId = Number(localStorage.getItem('activeTaskId')); // Convert the taskId to a number
        const task = this.taskManager.findTaskById(activeTaskId);
        if (task) {
            task[property] = value;
        } else {
            console.error(`Task with id ${activeTaskId} not found`);
        }
    }

    async loadTaskDetailsFromServer(taskId) {
        // Fetch the task details from the server
        const task = await this.taskSender.getTaskFromServer(taskId);

        // Populate the task details UI with the fetched data
        this.taskRename.value = task.name;
        this.descriptionBox.value = task.description;
        this.listSelect.value = task.selectedList;
        this.dueDateSelect.value = task.selectedDueDate;
        this.timeSelect.value = task.selectedTime;
        this.tagsSelect.value = task.selectedTags;

        // Clear the subtask list
        while (this.subtaskList.firstChild) {
            this.subtaskList.firstChild.remove();
        }

        // Add each subtask to the subtask list
        task.subtasks.forEach(subtask => {
            this.addSubtaskToDOM(subtask);
        });

        // Store the active task ID in local storage
        localStorage.setItem('activeTaskId', taskId);
    }
    

    // Open the task details view
    openTaskDetails(taskId) {
        this.loadTaskDetailsFromServer(taskId);
        this.rightMenuCard.classList.add('expanded');
        this.rightMenuCard.style.display = 'block';
        this.todoContainer.classList.add('right-expanded');
        this.todoContainer.style.width = 'calc(100% - 40%)';
    }
    
    // ... (other methods)
}
    
