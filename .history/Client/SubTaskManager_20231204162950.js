import DOMHelper from './DOMHelper.js';
import Subtask from './Subtask.js';

export default class SubTaskManager{

    constructor(task, domHelper) 
    {
        this.task = task;
        this.domHelper = domHelper;
        this.subtasks = this.task.subtasks || [];
        this.subtaskCount = this.subtasks.length;
        this.isInitialized = false;
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
            // Only store the properties of this.task that you need to persist
            tasks[taskIndex] = {
                id: this.task.id,
                name: this.task.name,
                subtasks: this.task.subtasks
                // Add any other properties you need to persist
            };
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
        console.log(addSubtaskBtn);
        if (addSubtaskBtn) {
            addSubtaskBtn.addEventListener('click', () => {
                const subtaskInput = this.domHelper.getElementById('new-subtask-input');
                const subtaskList = this.domHelper.getElementById('subtask-list');
                const subtaskName = subtaskInput.value;
                if (subtaskName) {
                    const newSubtask = this.createSubtaskElement(new Subtask(Date.now(), subtaskName));
                    newSubtask.querySelector('button').addEventListener('click', () => {
                        const subtaskIndex = this.task.subtasks.findIndex(subtask => subtask.name === subtaskName);
                        if (subtaskIndex > -1) {
                            this.task.subtasks.splice(subtaskIndex, 1);
                            this.updateTasksInStorage();
                        }
                        newSubtask.remove();
                    });
                    subtaskList.appendChild(newSubtask);
                    subtaskInput.value = '';
                    this.saveSubtask(subtaskName);
                }
            });
        }
    }

    init() {
        this.loadSubtasks();
        this.addSubtaskEventListener();
        this.isInitialized = true;
    }

    // // Load subtasks for current task
    // loadSubtasksForCurrentTask() {
    //     const taskId = this.task.getCurrentTaskId();
    //     if (taskId) {
    //         this.loadSubtasks(taskId);
    //     }
    // }

}