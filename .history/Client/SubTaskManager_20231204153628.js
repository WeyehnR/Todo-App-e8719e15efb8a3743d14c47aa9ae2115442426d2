import DomHelper from './DomHelper.js';
import Subtask from './Subtask.js';

export default class SubTaskManager{

    constructor(task)
    {
        this.task = task;
        this.domHelper = new DomHelper();
    }

    saveSubtask(subtaskName) {
        const subtask = new Subtask(Date.now(), subtaskName);
        this.task.subtasks.push(subtask);
        this.updateTasksInStorage();
    }

    updateTasksInStorage() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        let taskIndex = tasks.findIndex(t => t.id === this.task.id);
        if (taskIndex !== -1) {
            tasks[taskIndex] = this.task;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    loadSubtasks() {
        if (this.task && this.task.subtasks) {
            const subtaskList = this.domHelper.getElementById('subtask-list');
            subtaskList.innerHTML = '';
            this.task.subtasks.forEach((subtask, index) => {
                const newSubtask = this.createSubtaskElement(subtask);
                newSubtask.querySelector('button').addEventListener('click', () => {
                    newSubtask.remove();
                    this.task.subtasks.splice(index, 1);
                    this.updateTasksInStorage();
                });
                subtaskList.appendChild(newSubtask);
            });
        }
    }

    updateTasksInStorage() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        let taskIndex = tasks.findIndex(t => t.id === this.task.id);
        if (taskIndex !== -1) {
            tasks[taskIndex] = this.task;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    createSubtaskElement(subtask) {
        const newSubtask = document.createElement('li');
        newSubtask.appendChild(this.createCheckboxElement(subtask.isCompleted));
        newSubtask.appendChild(this.createLabelElement(subtask.name));
        newSubtask.appendChild(this.createDeleteButtonElement());
        return newSubtask;
    }

    createCheckboxElement(isCompleted) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isCompleted;
        return checkbox;
    }

    createLabelElement(text) {
        const label = document.createElement('label');
        label.textContent = text;
        return label;
    }

    createDeleteButtonElement() {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.style.float = 'right';
        return deleteButton;
    }
    addSubtaskEventListener() {
        const addSubtaskBtn = this.domHelper.getElementById('add-subtask-btn');
        if (addSubtaskBtn) {
            addSubtaskBtn.addEventListener('click', () => {
                const subtaskInput = this.domHelper.getElementById('new-subtask-input');
                const subtaskList = this.domHelper.getElementById('subtask-list');
                const subtask = subtaskInput.value;
                if (subtask) {
                    const newSubtask = this.createSubtaskElement(subtask);
                    newSubtask.querySelector('button').addEventListener('click', () => {
                        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                        let task = tasks.find(t => t.id === this.task.getTaskId()); // Use the getTaskId method
                        if (task) {
                            const subtaskIndex = task.subtasks.indexOf(subtask);
                            if (subtaskIndex > -1) {
                                task.subtasks.splice(subtaskIndex, 1);
                            }
                            localStorage.setItem('tasks', JSON.stringify(tasks));
                        }
                        newSubtask.remove();
                    });
                    subtaskList.appendChild(newSubtask);
                    subtaskInput.value = '';
                    const taskId = this.task.getTaskId(); // Use the getTaskId method
                    if (taskId) {
                        this.saveSubtask(taskId, subtask);
                    }
                }
            });
        }
    }

    // Load subtasks for current task
    loadSubtasksForCurrentTask() {
        const taskId = this.task.getCurrentTaskId();
        if (taskId) {
            this.loadSubtasks(taskId);
        }
    }

}