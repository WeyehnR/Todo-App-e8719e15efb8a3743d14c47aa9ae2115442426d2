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
        this.addTaskRenameInputListener();
        this.addDOMContentLoadedListener();
    }

    addTaskRenameInputListener() {
        const taskRenameInput = document.querySelector('.task-rename');
        if (taskRenameInput) {
            taskRenameInput.removeEventListener('input', this.handleInput);
            taskRenameInput.addEventListener('input', this.handleInput);
        }
    }

    addDOMContentLoadedListener() {
        document.removeEventListener('DOMContentLoaded', this.handleDOMContentLoaded);
        document.addEventListener('DOMContentLoaded', this.handleDOMContentLoaded);
    }

    handleInput = () => {
        const taskRenameInput = document.querySelector('.task-rename');
        localStorage.setItem('taskRenameInput', taskRenameInput.value);
    }

    handleDOMContentLoaded = () => {
        this.loadTasksFromLocalStorage();
        this.taskCount = this.tasks.length;
        this.selectLastClickedTask();
    }

    selectLastClickedTask() {
        const selectedTaskId = localStorage.getItem('selectedTaskId');
        if (selectedTaskId) {
            const selectedTask = this.tasks.find(task => String(task._id) === selectedTaskId);
            if (selectedTask) {
                const taskRenameInput = document.querySelector('.task-rename');
                taskRenameInput.value = selectedTask._name;
                this.updateUIWithTaskDetails(selectedTask);
            }
        }
    }

    addTask(name, description = '', selectedList = ['Select List'], selectedDueDate = ['Select Due Date'], selectedTags = ['Select Tags']) {
        const taskExists = this.tasks.some(task => 
            task.name === name && 
            task.description === description && 
            task.selectedList.toString() === selectedList.toString() && 
            task.selectedDueDate.toString() === selectedDueDate.toString() && 
            task.selectedTags.toString() === selectedTags.toString()
        );

        if (!taskExists) {
            const id = new Date().getTime().toString();
            const task = new Task(id, name, description, selectedList, selectedDueDate, selectedTags);
            task.renameValue = name;
            this.tasks.push(task);
            this.taskCount++;
            this.saveTaskToLocalStorage(task);
            return task;
        }
    }

    // Rest of the code...
}

export default TaskManager;