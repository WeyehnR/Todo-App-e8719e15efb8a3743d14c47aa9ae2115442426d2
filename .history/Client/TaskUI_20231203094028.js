
export default class TaskUI {
    constructor(taskManager, domHelper) {
        this.taskManager = taskManager;
        this.domHelper = domHelper;
    }

    getCurrentTaskId() {
        const activeTaskElement = this.domHelper.querySelector('.todo-list li.active');
        return activeTaskElement ? activeTaskElement.getAttribute('data-task') : null;
    }

    updateTaskCount() {
        const taskCountElement = document.querySelector('#today-task-counter');
        if (taskCountElement) {
            taskCountElement.textContent = this.taskManager.taskCount;
        }
    }

    checkTaskOverflow() {
        const todoList = this.domHelper.querySelector('.todo-list');
        if (this.taskManager.tasks.length > 5) {
            todoList.classList.add('overflow');
        } else {
            todoList.classList.remove('overflow');
        }
    }

    addTaskEventListener() {
        // ... same as before ...
    }

    addTaskClickEventListener() {
        // ... same as before ...
    }

    attachDeleteEventListeners() {
        // ... same as before ...
    }
}