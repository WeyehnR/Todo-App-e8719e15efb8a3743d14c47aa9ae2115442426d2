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
        // Initialization code here

        // Set isInitialized to true
        this.isInitialized = true;
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
    }
}