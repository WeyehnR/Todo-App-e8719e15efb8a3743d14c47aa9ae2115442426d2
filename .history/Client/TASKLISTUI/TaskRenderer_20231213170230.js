// TaskRenderer.js
import DOMHelper from '../DOMHelper/DOMHelper.js';
import TaskDetailsUI from './TaskDetailsUI.js';
import TaskSender from './TaskSender.js';

export default class TaskRenderer {
    constructor(taskManager) {
        this.taskManager = taskManager;
        this.domHelper = new DOMHelper();
        this.taskSender = new TaskSender();
        this.taskListContainer = this.domHelper.querySelector('.todo-list');
        this.rightMenuCard = this.domHelper.querySelector('#right-menu-card');
        this.todoContainer = this.domHelper.querySelector('.todo-container');
        this.taskRenameInput = this.domHelper.querySelector('.task-rename');
        this.descriptionBox = this.domHelper.querySelector('.description-box');
        this.closeIcon = this.domHelper.querySelector('.close-icon');

        this.taskListContainer.addEventListener('click', this.handleTaskListClick.bind(this));
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
        this.taskListContainer.innerHTML = ''; // Clear the task list container
        tasks.forEach(task => {
            const taskElement = this.renderTask(task, false);
            this.taskListContainer.appendChild(taskElement); // Append the task element to the task list container
        });
    }
    // Add this method to handle arrow button click event using event delegation
    handleTaskListClick(event) {
        const arrowBtn = event.target.closest('.arrow-btn');
        if (arrowBtn) {
            const taskElement = arrowBtn.closest('[data-task]');
            const taskId = Number(taskElement.dataset.task);
            const task = this.taskManager.findTaskById(taskId);
            this.handleArrowButtonClick(event ,task);
        } else {
            // If the clicked element is not the arrow button, close the right menu
            this.rightMenuCard.style.display = 'none';
        }
    }

    // Handle the arrow button click event
async handleArrowButtonClick(event, task) {
    event.stopPropagation();
    // Set the data-task-id attribute of the right menu card to the task id
    this.rightMenuCard.setAttribute('data-task-id', task.id);

    // Set the active task id in local storage
    localStorage.setItem('activeTaskId', task.id);

    // Only open the right card menu do not close it
    this.rightMenuCard.style.display = 'block';

    try {
        // Fetch the task from the server
        const fetchedTask = await this.taskSender.getTaskFromServer(task.id);

        // Update the task fields with the fetched task's name and description
        this.updateTaskFields(fetchedTask.name, fetchedTask.description);

        // If the fetched task has a due date, create a div element for it
        if (fetchedTask.selectedDueDate) {
            const dueDateElement = document.createElement('div');
            dueDateElement.textContent = fetchedTask.selectedDueDate;

            // Find the selected task in the DOM
            const selectedTask = this.domHelper.querySelector(`li[data-task="${task.id}"]`);

            // Create a container for the label and the due date
            const labelAndDateContainer = document.createElement('div');

            // Get the label element
            const labelElement = selectedTask.querySelector('label');

            // Append the label and the due date to the container
            labelAndDateContainer.appendChild(labelElement);
            labelAndDateContainer.appendChild(dueDateElement);

            // Append the container to the selected task
            selectedTask.appendChild(labelAndDateContainer);
        }
    } catch (err) {
        console.error('Failed to fetch task from server:', err);
        // Show an error message in the UI...
    }

    // Create an instance of the TaskDetailsUI class
    const taskDetailsUI = new TaskDetailsUI(this.taskManager, this.ui);

    // Load the task details from the server
    await taskDetailsUI.loadTaskDetailsFromServer(task.id);
}


    
    // Create a DOM element for a task
    createTaskElement(task) {
        console.log('Creating task element:', task); // Add this line
        const li = document.createElement('li');
        li.dataset.task = task.id;

        li.innerHTML = `
            <button class="arrow-btn"></button>
            <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
            <label for="task-${task.id}">${task.name}</label>
        `;

        // Add event listeners
        const checkbox = li.querySelector(`#task-${task.id}`);
        checkbox.addEventListener('change', () => {
            const taskElement = this.domHelper.querySelector(`[data-task="${task.id}"]`);
            taskElement.classList.toggle('completed', checkbox.checked);
            task.completed = checkbox.checked; // Update the task's completed status
            this.taskManager.saveTasksToLocalStorage(); // Save the updated task to local storage
        });

        return li;
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