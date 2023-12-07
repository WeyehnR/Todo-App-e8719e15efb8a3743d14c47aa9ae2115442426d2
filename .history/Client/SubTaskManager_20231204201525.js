import DOMHelper from './DOMHelper.js';
import Subtask from './Subtask.js';

export default class SubTaskManager{

    constructor(task, domHelper) 
    {
        this.task = task;
        this.domHelper = domHelper;
        this.subtasks = this.task._subtasks || [];
        this.subtaskCount = this.subtasks.length;
        this.isInitialized = false;
    }

    saveSubtask(subtaskName) {
        const subtask = new Subtask(Date.now(), subtaskName);
        this.task._subtasks.push(subtask);
        this.updateTasksInStorage();
    }

    updateTasksInStorage() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        let taskIndex = tasks.findIndex(t => t._id === this.task._id);
        if (taskIndex !== -1) {
            tasks[taskIndex]._subtasks = this.task._subtasks.map(subtask => ({
                _id: subtask._id,
                _name: subtask._name,
                _isCompleted: subtask._isCompleted
            }));
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    loadSubtasks() {
        if (this.task && this.task._subtasks) {
            this.task._subtasks = this.task._subtasks.map(subtaskData => {
                const subtask = new Subtask(subtaskData._id, subtaskData._name);
                subtask._isCompleted = subtaskData._isCompleted;
                return subtask;
            });
        }
    }

    renderSubtasks() {
        const subtaskList = this.domHelper.getElementById('subtask-list');
        subtaskList.innerHTML = '';
        this.task._subtasks.forEach((subtask) => {
            const subtaskElement = this.createSubtaskElement(subtask);
            subtaskElement.querySelector('button').addEventListener('click', () => {
                const index = this.task._subtasks.indexOf(subtask);
                if (index > -1) {
                    subtaskElement.remove();
                    this.task._subtasks.splice(index, 1);
                    this.updateTasksInStorage();
                }
            });
            subtaskList.appendChild(subtaskElement);
        });
    }

    createSubtaskElement(subtask) {
        const newSubtask = document.createElement('li');
        console.log('subtask name:', subtask._name);
        newSubtask.appendChild(this.createCheckboxElement(subtask._isCompleted));
        newSubtask.appendChild(this.createLabelElement(subtask._name));
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
        console.log('addSubtaskBtn is available');
        if (addSubtaskBtn) {
            addSubtaskBtn.addEventListener('click', () => {
                const subtaskInput = this.domHelper.getElementById('new-subtask-input');
                const subtaskList = this.domHelper.getElementById('subtask-list');
                const subtaskName = subtaskInput.value;
                if (subtaskName) {
                    const newSubtaskObject = new Subtask(Date.now(), subtaskName);
                    const newSubtaskElement = this.createSubtaskElement(newSubtaskObject);
                    newSubtaskElement.querySelector('button').addEventListener('click', () => {
                        const subtaskIndex = this.task._subtasks.findIndex(subtask => subtask._name === subtaskName);
                        if (subtaskIndex > -1) {
                            this.task._subtasks.splice(subtaskIndex, 1);
                            this.updateTasksInStorage();
                        }
                        newSubtaskElement.remove();
                    });
                    subtaskList.appendChild(newSubtaskElement);
                    subtaskInput.value = '';
                    this.saveSubtask(subtaskName);
                }
            });
        }
    }

    init() {
        this.loadSubtasks();
        this.addSubtaskEventListener();
        this.renderSubtasks();
        this.isInitialized = true;
    }

}