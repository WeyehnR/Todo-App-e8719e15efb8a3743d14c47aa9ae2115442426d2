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

    // ... (rest of the methods, including deleteTask and saveChanges)

    // You can refactor and transfer other relevant methods from TaskUI as needed
}
