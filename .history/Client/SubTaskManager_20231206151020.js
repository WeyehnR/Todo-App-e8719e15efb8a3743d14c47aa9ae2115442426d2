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
        // Load subtasks from local storage
        const subtasksJson = localStorage.getItem(`task-${this.task._id}-subtasks`);
        if (subtasksJson) {
            this.task._subtasks = JSON.parse(subtasksJson);
        } else {
            // If there are no subtasks in local storage, initialize an empty array
            this.task._subtasks = [];
        }

        this.setupEventListener();

        // Set isInitialized to true
        this.isInitialized = true;
    }

    renderSubtasks() {
        // Get the subtask-list element
        const subtaskList = document.getElementById('subtask-list');

        // Clear the subtask-list element
        subtaskList.innerHTML = '';

        // For each subtask in this.task._subtasks
        for (let i = 0; i < this.task._subtasks.length; i++) {
            // Create a new list item
            const listItem = this.createSubtaskElement(this.task._subtasks[i]);

            // Append the list item to the subtask-list element
            subtaskList.appendChild(listItem);
        }
    }

    addSubtask(subtask) {
        // Ensure this.task is the currently selected task
    console.log('At the beginning of addSubtask, this.task is:', this.task);

    const selectedTaskId = localStorage.getItem('selectedTaskId');
    const tasks = JSON.parse(localStorage.getItem('tasks'));

    // Log the tasks and selectedTaskId
    console.log('tasks:', tasks);
    console.log('selectedTaskId:', selectedTaskId);

    if (!this.task || this.task._id !== selectedTaskId) {
        // Update this.task to the currently selected task
        this.task = tasks.find(task => task._id === selectedTaskId);
        this.subtasks = this.task._subtasks || [];

        console.log('After updating this.task, it is:', this.task);

        // Check if this.task is defined after trying to update it
        if (!this.task) {
            console.error('Cannot add subtask: SubTaskManager has not been initialized with a task.');
            return;
        }
    }

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
                tasks[i] = JSON.parse(JSON.stringify(this.task)); // Deep copy the task
                break;
            }
        }

        // Save the updated tasks array to local storage
        localStorage.setItem('tasks', JSON.stringify(tasks));
        this.renderSubtasks();

        // Save the task to localStorage
        this.saveSubtasksToLocalStorage();
    }

    clearSubtasks() {
        // Get the UI element that contains the subtasks
        const subtaskList = document.getElementById('subtask-list');

        // Clear the UI element
        subtaskList.innerHTML = '';
    }

    saveSubtasksToLocalStorage() {
        localStorage.setItem(`task-${this.task._id}-subtasks`, JSON.stringify(this.task._subtasks));
    }

    // Call this method whenever the subtasks are updated
    updateSubtasks(newSubtasks) {
        this.task._subtasks = newSubtasks;
        this.saveSubtasksToLocalStorage();
    }

    createSubtaskElement(subtask) {
        // Create a new list item element
        const subtaskElement = document.createElement('li');

        // Create a new checkbox element
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = subtask._isCompleted;

        // Add an event listener to the checkbox
        checkbox.addEventListener('change', () => {
            subtask._isCompleted = checkbox.checked;
            this.saveSubtasksToLocalStorage();
            this.renderSubtasks();
        });

        // Set the text of the list item to the name of the subtask
        const textNode = document.createTextNode(subtask._name);

        // Append the checkbox and the text node to the list item
        subtaskElement.appendChild(checkbox);
        subtaskElement.appendChild(textNode);

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
                const subtask = new Subtask(Date.now(), subtaskName);

                // Add the subtask to the subtask list
                this.addSubtask(subtask);
            }

            // Clear the input field
            newSubtaskInput.value = '';
        };

        addSubtaskBtn.addEventListener('click', this.eventListener);
    }

    
}