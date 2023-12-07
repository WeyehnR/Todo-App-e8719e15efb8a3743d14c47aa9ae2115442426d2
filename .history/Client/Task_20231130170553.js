class Task {
    constructor(id, description, isCompleted = false, subtasks = []) {
        this.id = id;
        this.description = description;
        this.isCompleted = isCompleted;
        this.subtasks = subtasks;
    }

    toggleComplete() {
        this.isCompleted = !this.isCompleted;
    }

    addSubtask(subtask) {
        this.subtasks.push(subtask);
    }

    removeSubtask(subtaskId) {
        this.subtasks = this.subtasks.filter(subtask => subtask.id !== subtaskId);
    }

    saveToLocalStorage() {
        return new Promise((resolve, reject) => {
            try {
                localStorage.setItem(`task-${this.id}`, JSON.stringify(this));
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    static loadFromLocalStorage(id) {
        return new Promise((resolve, reject) => {
            try {
                const taskData = JSON.parse(localStorage.getItem(`task-${id}`));
                if (taskData) {
                    const task = new Task(taskData.id, taskData.description, taskData.isCompleted, taskData.subtasks);
                    resolve(task);
                } else {
                    resolve(null);
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default Task;