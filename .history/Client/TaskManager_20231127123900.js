class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    }

    getAllTasks() {
        return this.tasks;
    }

    saveAllTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    addTask(description) {
        const task = new Task(Date.now(), description);
        this.tasks.push(task);
        this.saveAllTasks();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveAllTasks();
    }
}