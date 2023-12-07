import DomHelper from './DomHelper.js';
import Subtask from './Subtask.js';

export default class SubTaskManager{

    addSubtaskEventListener() {
        const addSubtaskBtn = this.domHelper.getElementById('add-subtask-btn');
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

    // Load subtasks for current task
    loadSubtasksForCurrentTask() {
        const taskId = this.task.getCurrentTaskId();
        if (taskId) {
            this.loadSubtasks(taskId);
        }
    }

}