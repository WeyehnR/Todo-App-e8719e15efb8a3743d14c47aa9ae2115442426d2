import Task from './Task.js';

class TaskManager {
    constructor() {
        this.tasks = [];
        this.taskCount = 0;
    }

    setUI(ui) {
        this.ui = ui;
        this.addEventListeners();
    }

    addEventListeners() {
        this.addInputEventListener('.task-rename', this.handleInput);
        this.addDocumentEventListener('DOMContentLoaded', this.handleDOMContentLoaded);
    }

    addInputEventListener(selector, handler) {
        const element = document.querySelector(selector);
        if (element) {
            element.removeEventListener('input', handler);
            element.addEventListener('input', handler);
        }
    }

    addDocumentEventListener(event, handler) {
        document.removeEventListener(event, handler);
        document.addEventListener(event, handler);
    }

    handleInput = () => {
        this.saveInputValueToLocalStorage('.task-rename', 'taskRenameInput');
    }

    saveInputValueToLocalStorage(selector, key) {
        const element = document.querySelector(selector);
        localStorage.setItem(key, element.value);
    }

    handleDOMContentLoaded = () => {
        this.loadTasksFromLocalStorage();
        this.taskCount = this.tasks.length;
        this.selectTaskFromLocalStorage();
    }

    selectTaskFromLocalStorage() {
        const selectedTaskId = localStorage.getItem('selectedTaskId');
        if (selectedTaskId) {
            const selectedTask = this.tasks.find(task => String(task._id) === selectedTaskId);
            if (selectedTask) {
                this.updateUIWithTaskDetails(selectedTask);
            }
        }
    }

    loadTasksFromLocalStorage(){
        
    }

    // ... rest of your methods remain the same ...

    selectTask(task) {
        this.saveInputValueToLocalStorage('.task-rename', task._name);
        this.updateUIWithTaskDetails(task);
        localStorage.setItem('selectedTaskId', task._id);
    }

    updateRenameInputWithSelectedTask() {
        const selectedTaskId = localStorage.getItem('selectedTaskId');
        const selectedTask = this.tasks.find(task => String(task._id) === selectedTaskId);
        this.saveInputValueToLocalStorage('.task-rename', selectedTask ? selectedTask._name : '');
    }
}

export default TaskManager;