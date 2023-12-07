class Task {
    constructor(id,name,description, isCompleted = false, subtasks = []) {
        this.id = id;
        this.name = name;
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
        localStorage.setItem(`task-${this.id}`, JSON.stringify(this));
    }

    static loadFromLocalStorage(id) {
        const taskData = JSON.parse(localStorage.getItem(`task-${id}`));
        if (taskData) {
            const task = new Task(taskData.id, taskData.description, taskData.isCompleted, taskData.subtasks);
            return task;
        } else {
            return null;
        }
    }
}

export default Task;