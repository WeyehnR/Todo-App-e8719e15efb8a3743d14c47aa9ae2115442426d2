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
        // Get references to the add button and the input field
        const addSubtaskBtn = document.getElementById('add-subtask-btn');
        const newSubtaskInput = document.getElementById('new-subtask-input');

        // Set up a click event listener on the add button
        addSubtaskBtn.addEventListener('click', () => {
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
        });

        // Set isInitialized to true
        this.isInitialized = true;
    }

    renderSubtasks() {
        // Get the subtask list element in the DOM
        const subtaskList = document.getElementById('subtask-list');

        // Clear the subtask list
        subtaskList.innerHTML = '';

        // For each subtask in the _subtasks array, create a list item and add it to the subtask list
        for (let i = 0; i < this.subtasks.length; i++) {
            const subtaskListItem = document.createElement('li');
            subtaskListItem.textContent = this.subtasks[i]._id;
            subtaskList.appendChild(subtaskListItem);
        }
    }

    addSubtask(subtask) {
        // Add the subtask to the task's _subtasks array
        this.task._subtasks.push(subtask);

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
}