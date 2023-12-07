class Task {
    constructor(id, name, description, isCompleted = false, subtasks = []) {
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
        const initialLength = this.subtasks.length;
        this.subtasks = this.subtasks.filter(subtask => subtask.id !== subtaskId);
        return initialLength !== this.subtasks.length;
    }

    saveToLocalStorage() {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(`task-${this.id}`, JSON.stringify(this));
        }
    }

    static loadFromLocalStorage(id) {
        if (typeof localStorage !== 'undefined') {
            const taskData = JSON.parse(localStorage.getItem(`task-${id}`)) ?? null;
            if (taskData) {
                const task = new Task(taskData.id, taskData.name, taskData.description, taskData.isCompleted, taskData.subtasks);
                return task;
            }
        }
        return null;
    }
}

export default Task;