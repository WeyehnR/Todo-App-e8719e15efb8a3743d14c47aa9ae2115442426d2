class TaskManager {
    constructor() {
        this.tasks = [];
    }

    createTask(task) {
        this.tasks.push(task);
    }

    readTask(task) {
        return task;
    }

    update

    deleteTask(taskId) {
        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        return initialLength !== this.tasks.length;
    }

    findTaskById(taskId) {
        return this.tasks.find(task => task.id === taskId);
    }
}