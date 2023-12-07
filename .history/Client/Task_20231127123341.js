// Define the Task class
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
}

