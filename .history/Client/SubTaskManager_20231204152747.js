import DomHelper from './DomHelper.js';


export default class SubTaskManager{

    constructor()
    {
        this.domHelper = new DomHelper();
    }

    saveSubtask(taskId, subtaskName) { // Change the parameter name to subtaskName
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        let task = tasks.find(task => task.id === taskId);
        if (task) {
            if (!task.subtasks) {
                task.subtasks = [];
            }
            const subtask = new Subtask(Date.now(), subtaskName); // Create a new Subtask instance
            task.subtasks.push(subtask);
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
        newSubtask.appendChild(checkbox);
        const label = document.createElement('label');
        label.textContent = subtask;
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
                        let task = tasks.find(t => t.id === this.getCurrentTaskId());
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
                    const taskId = this.getCurrentTaskId();
                    if (taskId) {
                        this.saveSubtask(taskId, subtask);
                    }
                }
            });
        }
    }

    // Load subtasks for current task
    loadSubtasksForCurrentTask() {
        const taskId = this.getCurrentTaskId();
        if (taskId) {
            this.loadSubtasks(taskId);
        }
    }

}