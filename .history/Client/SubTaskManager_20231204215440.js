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

        // Log the task's _subtasks array
        console.log('Rendering subtasks:', this.task._subtasks);

        // Render the new subtasks
        this.task._subtasks.forEach(subtask => {
            const subtaskElement = this.createSubtaskElement(subtask);
            subtaskList.appendChild(subtaskElement);
        });
    }

    addSubtask(subtask) {
        // Add the subtask to the task's _subtasks array
        this.task._subtasks.push(subtask);

        // Log the task's _subtasks array
        console.log('Added subtask:', this.task._subtasks);

        // Update the subtask count
        this.subtaskCount = this.task._subtasks.length;

        // Convert the task to a JSON string
        const taskJson = JSON.stringify(this.task);

        // Save the JSON string to local storage
        localStorage.setItem(`task-${this.task._id}`, taskJson);

        // Get the tasks array from local storage
        const tasks = JSON.parse(localStorage.getItem('tasks'));

        // Find the task in the tasks array and update it
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i]._id === this.task._id) {
                tasks[i] = this.task;
                break;
            }
        }

        // Save the updated tasks array to local storage
        localStorage.setItem('tasks', JSON.stringify(tasks));
        this.renderSubtasks();
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