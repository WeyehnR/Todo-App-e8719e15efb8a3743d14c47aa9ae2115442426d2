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

    updateTask(task) {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index === -1) {
            throw new Error(`Task with ID ${task.id} not found`);
        }
        this.tasks.splice(index, 1, task);
    }

    deleteTask(taskId) {
        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        return initialLength !== this.tasks.length;
    }

    findTaskById(taskId) {
        return this.tasks.find(task => task.id === taskId);
    }
}