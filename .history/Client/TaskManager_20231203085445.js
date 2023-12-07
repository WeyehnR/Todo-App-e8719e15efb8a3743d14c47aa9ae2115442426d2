import Task from './Task.js';

class TaskManager {
    constructor() {
        this.tasks = this.loadTasksFromLocalStorage();
    }

    addTask(name, description) {
        if (!name || !description) {
            console.error('Name and description must not be undefined or null');
            return;
        }

        const id = new Date().getTime().toString();  // Use timestamp as id
        const task = new Task(id, name, description);
        this.tasks.push(task);
        this.saveAllTasks();
        return task;
    }

    deleteTask(id){
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) {
            console.error('Task not found');
            return false;
        }

        this.tasks.splice(taskIndex, 1);
        this.saveAllTasks();
        return true;
    }

    saveAllTasks() {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        }
    }

    loadTasksFromLocalStorage() {
        if (typeof localStorage !== 'undefined') {
            const tasksData = JSON.parse(localStorage.getItem('tasks')) ?? [];
            return tasksData.map(taskData => new Task(taskData.id, taskData.name, taskData.description, taskData.isCompleted, taskData.subtasks));
        }
        return [];
    }

    // ... rest of the methods ...
}

export default TaskManager;