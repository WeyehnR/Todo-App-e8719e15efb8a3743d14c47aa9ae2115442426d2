import DOMHelper from './DOMHelper.js';
import Subtask from './Subtask.js';

export default class SubTaskManager {

    constructor(task, domHelper) {
        this.task = task;
        this.domHelper = domHelper;
        this.subtasks = this.task._subtasks || [];
        this.subtaskCount = this.subtasks.length;
        this.isInitialized = false;
    }

    init() {
        this.setupEventListener();

        // Set isInitialized to true
        this.isInitialized = true;
    }

    renderSubtasks() {
        // Get the subtask list element
        const subtaskList = document.getElementById('subtask-list');

        // Clear the existing subtasks
        subtaskList.innerHTML = '';

        // Render the new subtasks
        this.task._subtasks.forEach(subtask => {
            const subtaskElement = this.createSubtaskElement(subtask);
            subtaskList.appendChild(subtaskElement);
        });
    }

    createSubtaskElement(subtask) {
        // Create a new list item element
        const subtaskElement = document.createElement('li');

        // Set the text of the list item to the name of the subtask
        subtaskElement.textContent = subtask._name;

        // Return the new list item element
        return subtaskElement;
    }

    setupEventListener() {
        // Get references to the add button and the input field
        const addSubtaskBtn = document.getElementById('add-subtask-btn');
        const newSubtaskInput = document.getElementById('new-subtask-input');

        // Remove old event listener
        if (this.eventListener) {
            addSubtaskBtn.removeEventListener('click', this.eventListener);
        }

        // Set up a new event listener on the add button
        this.eventListener = () => {
            // Get the text from the input field
            const subtaskName = newSubtaskInput.value;

            // Check if the subtaskName is not empty
            if (subtaskName.trim() !== '') {
                // Create a new subtask with the text
                const subtask = new Subtask(subtaskName);

                // Add the subtask to the subtask list
                this.addSubtask(subtask);
            }

            // Clear the input field
            newSubtaskInput.value = '';
        };

        addSubtaskBtn.addEventListener('click', this.eventListener);
    }

    
}