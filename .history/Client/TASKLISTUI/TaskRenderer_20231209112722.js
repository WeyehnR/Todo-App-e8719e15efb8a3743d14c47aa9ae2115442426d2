// TaskRenderer.js
import DOMHelper from '../DOMHelper/DOMHelper.js';

export default class TaskRenderer {
    constructor(taskManager) {
        this.taskManager = taskManager;
        this.domHelper = new DOMHelper();
        this.taskListContainer = this.domHelper.querySelector('.todo-list');
        this.rightMenuCard = this.domHelper.querySelector('#right-menu-card');
        this.todoContainer = this.domHelper.querySelector('.todo-container');
        this.taskRenameInput = this.domHelper.querySelector('.task-rename');
        this.descriptionBox = this.domHelper.querySelector('.description-box');
        this.closeIcon = this.domHelper.querySelector('.close-icon');
    }

    // Update the right menu card visibility based on the number of tasks
    updateRightMenuCardVisibility() {
        if (this.taskListContainer.children.length === 0) {
            this.rightMenuCard.style.display = 'none';
        } else {
            this.rightMenuCard.style.display = 'block';
        }
    }

    // Render a single task
    renderTask(task, updateRightMenu = true) {
        const taskElement = this.createTaskElement(task);
        if (updateRightMenu) {
            this.updateRightMenuCardVisibility();
        }
        return taskElement;
    }

    renderTasks() {
        const tasks = this.taskManager.getTasks();
        console.log('Tasks: ',tasks);
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
        arrowBtn.addEventListener('click', (event) => {
            console.log('arrow created!', event);
            event.stopPropagation(); // Prevent checkbox click event from firing
            this.handleArrowButtonClick(task);
        });
        
        const checkbox = li.querySelector(`#task-${task.id}`);
        checkbox.addEventListener('change', () => {
            const taskElement = this.domHelper.querySelector(`[data-task="${task.id}"]`);
            taskElement.classList.toggle('completed', checkbox.checked);
            task.completed = checkbox.checked; // Update the task's completed status
        });

        return li;
    }

    // Handle the arrow button click event
    handleArrowButtonClick(task) {
        console.log('Arrow button event listener called!'); // Add this line
        this.rightMenuCard.classList.add('expanded');
        this.rightMenuCard.style.display = 'block';
        this.todoContainer.classList.add('right-expanded');

        // Set the data-task-id attribute of the right menu card to the task id
        this.rightMenuCard.setAttribute('data-task-id', task.id);

        // Set the active task id in local storage
        localStorage.setItem('activeTaskId', task.id);

        // Update the task fields with the task's name and description
        this.updateTaskFields(task.name, task.description);

        // Add event listener to close icon
        this.closeIcon.addEventListener('click', () => {
            this.rightMenuCard.classList.remove('expanded');
            this.rightMenuCard.style.display = 'none';
            this.todoContainer.classList.remove('right-expanded');
        });
    }

    updateTaskFields(taskName, taskDescription) {
        const taskTitle = this.domHelper.querySelector('.task-title');
        const taskRename = this.domHelper.querySelector('.task-rename');
        const descriptionBox = this.domHelper.querySelector('.description-box');
        taskTitle.textContent = `Task: ${taskName}`;
        taskRename.placeholder = taskName;
        taskRename.value = taskName;
        descriptionBox.value = taskDescription || 'Task Description';
    }
}