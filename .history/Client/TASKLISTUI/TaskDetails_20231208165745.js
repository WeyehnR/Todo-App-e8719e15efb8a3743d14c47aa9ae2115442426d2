// TaskDetailsUI.js

// Import necessary modules and classes, including DOMHelper

export default class TaskDetailsUI {
    constructor(taskManager, ui) {
        // Initialize TaskDetailsUI with references to taskManager, UI, and DOMHelper
        this.taskManager = taskManager;
        this.ui = ui;
        this.domHelper = new DOMHelper();

        // Get references to relevant HTML elements
        this.rightMenuCard = this.domHelper.querySelector('#right-menu-card');
        this.descriptionBox = this.domHelper.querySelector('.description-box');
        this.dueDateSelect = this.domHelper.querySelector('#due-date-select');
        this.timeSelect = this.domHelper.querySelector('#due-time-select');
        this.listSelect = this.domHelper.querySelector('#list-select');
        this.tagsSelect = this.domHelper.querySelector('#tags-select');
        this.subtaskList = this.domHelper.querySelector('#subtask-list');
        this.taskRename = this.domHelper.querySelector('.task-rename');
    }

    // Initialize the TaskDetailsUI and set up event listeners
    init() {
        // Add event listeners for task details view

        // Close button event listener
        const closeButton = this.domHelper.querySelector('.close-icon');
        closeButton.addEventListener('click', () => {
            this.ui.closeRightMenu();
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
                this.addSubtaskToDOM(subtask);
                this.updateLocalStorageWithSubtask(subtask);
                this.domHelper.querySelector('#new-subtask-input').value = '';
            }
        });

        // Call a method to render task details (if needed)
    }
    // Delete a task by its ID
     deleteTask(activeTaskId) {
        this.taskManager.deleteTask(activeTaskId);
        const activeTaskElement = this.domHelper.querySelector(`[data-task="${activeTaskId}"]`);
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

    // Save changes to a task
    saveChanges(activeTaskId) {
        const taskDetails = this.domHelper.querySelector('#right-menu-card');
        const taskName = taskDetails.querySelector('.task-rename').value;
        const taskDescription = taskDetails.querySelector('.description-box').value;
        const taskList = taskDetails.querySelector('#list-select').value;
        const taskDueDate = taskDetails.querySelector('#due-date-select').value;
        const taskTime = taskDetails.querySelector('#due-time-select').value;
        const taskTags = taskDetails.querySelector('#tags-select').value;

        // Retrieve subtask elements and store them in an array
        const subtaskElements = taskDetails.querySelectorAll('#subtask-list li');
        const subtasks = Array.from(subtaskElements).map(element => element.textContent);

        // Find the task by its ID
        const task = this.taskManager.findTaskById(activeTaskId);
        if (!task) {
            return;
        }

        // Update task properties with user input
        task.name = taskName;
        task.description = taskDescription;
        task.selectedList = taskList;
        task.selectedDueDate = taskDueDate;
        task.selectedTime = taskTime;
        task.selectedTags = taskTags;
        task.subtasks = subtasks;

        // Update the task in the TaskManager
        this.taskManager.updateTask(task);

        // Update tasks in local storage
        localStorage.setItem('tasks', JSON.stringify(this.taskManager.getTasks()));

        // Update the task label in the task list
        const taskElement = document.querySelector(`[data-task="${task.id}"]`);
        const taskLabel = taskElement.querySelector('label');
        taskLabel.textContent = task.name;
    }

    // ... (rest of the methods, including deleteTask and saveChanges)

    // You can refactor and transfer other relevant methods from TaskUI as needed
}
