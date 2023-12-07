import DOMHelper from './DOMHelper.js';
import Subtask from './Subtask.js';
import Task from './Task.js';
import TaskManager from './TaskManager.js';

class SubTaskManager extends TaskManager {
    constructor(task, domHelper) {
        super([task]); // pass the task as an array to the parent constructor
        this.domHelper = domHelper;
    }

    // Override the methods that need to behave differently
    addEventListeners() {
        this.addInputEventListener('#add-subtask-btn', this.addNewSubtask);
        this.addDocumentEventListener('DOMContentLoaded', this.handleDOMContentLoaded);
    }

    addNewSubtask = () => {
        const newSubtaskInput = document.querySelector('#new-subtask-input');
        if (newSubtaskInput && newSubtaskInput.value) {
            this.selectedTask._subtasks.push({ _id: Date.now(), _name: newSubtaskInput.value, _isCompleted: false });
            this.saveTasksToLocalStorage();
            this.renderTasks();
        }
    }

    saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasksFromLocalStorage() {
        const tasksJson = localStorage.getItem('tasks');
        if (tasksJson) {
            this.tasks = JSON.parse(tasksJson);
        }
    }

    // ... rest of the methods
}