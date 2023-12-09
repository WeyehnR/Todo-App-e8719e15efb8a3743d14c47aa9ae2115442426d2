// TaskRenderer.js
import DOMHelper from '../DOMHelper/DOMHelper.js';

export default class TaskRenderer {
    constructor(taskManager) {
        this.taskManager = taskManager;
        this.domHelper = new DOMHelper();
        this.taskListContainer = this.domHelper.querySelector('.todo-list');
    }

    renderTasks() {
        const tasks = this.taskManager.getTasks();
        let html = '';
        tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            html += taskElement.outerHTML;
        });
        this.taskListContainer.innerHTML = html;
    }

    createTaskElement(task) {
        // ... existing code ...
    }
}