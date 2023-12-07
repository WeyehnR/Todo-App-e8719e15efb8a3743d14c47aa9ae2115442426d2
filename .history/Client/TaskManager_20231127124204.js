class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    }

    getAllTasks() {
        return this.tasks.map(id => Task.loadFromLocalStorage(id));
    }

    saveAllTasks() {
        const taskIds = this.tasks.map(task => task.id);
        localStorage.setItem('tasks', JSON.stringify(taskIds));
    }

    addTask(description) {
        const task = new Task(Date.now(), description);
        this.tasks.push(task);
        task.saveToLocalStorage();
        this.saveAllTasks();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveAllTasks();
        localStorage.removeItem(`task-${id}`);
    }
}