class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
    }

    removeTask(taskId) {
        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        return initialLength !== this.tasks.length;
    }

    findTaskById(taskId) {
        return this.tasks.find(task => task.id === taskId);
    }
}