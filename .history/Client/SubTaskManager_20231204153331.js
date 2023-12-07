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

    loadSubtasks(taskId) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        let task = tasks.find(task => task.id === taskId);
        if (task && task.subtasks) {
            const subtaskList = this.domHelper.getElementById('subtask-list');
            subtaskList.innerHTML = '';
            task.subtasks.forEach((subtask, index) => {
                const newSubtask = this.createSubtaskElement(subtask);
                newSubtask.domHelper.querySelector('button').addEventListener('click', () => {
                    newSubtask.remove();
                    task.subtasks.splice(index, 1);
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                });
                subtaskList.appendChild(newSubtask);
            });
        }
    }

    createSubtaskElement(subtask) {
        const newSubtask = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = subtask.isCompleted; // Set the checkbox status based on the subtask's isCompleted property
        newSubtask.appendChild(checkbox);
        const label = document.createElement('label');
        label.textContent = subtask.name; // Use the subtask's name property
        newSubtask.appendChild(label);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.style.float = 'right';
        newSubtask.appendChild(deleteButton);
        return newSubtask;
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