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

    
    // Create a DOM element for a task
    createTaskElement(task) {
        const li = document.createElement('li');
        li.dataset.task = task.id;

        li.innerHTML = `
            <button class="arrow-btn"></button>
            <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
            <label for="task-${task.id}">${task.name}</label>
        `;

        // Add event listeners
        const arrowBtn = li.querySelector('.arrow-btn');
        arrowBtn.addEventListener('click', event => this.handleArrowButtonClick(event, task));

        const checkbox = li.querySelector(`#task-${task.id}`);
        checkbox.addEventListener('change', () => {
            const taskElement = this.domHelper.querySelector(`[data-task="${task.id}"]`);
            taskElement.classList.toggle('completed', checkbox.checked);
            task.completed = checkbox.checked; // Update the task's completed status
        });

        return li;
    }
}