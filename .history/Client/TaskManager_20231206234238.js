export default class TaskManager {
    constructor(task = []) {
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

    updateTaskList(taskId, selectedList) {
        // Find the task with the given ID

        console.log('taskId: ' + taskId);
        
        const task = this.tasks.find(t => t.id === taskId);

        // If the task was found, update its list property
        if (task) {
            task.selectedList = selectedList;
        } else {
            throw new Error(`Task with ID ${taskId} not found`);
        }
    }

    getTasks()
    {
        return this.tasks;
    }

    setTask(task) {
        // Find the index of the task with the same ID as the given task
        const index = this.tasks.findIndex(t => t.id === task.id);

        // If the task was found, update it
        if (index !== -1) {
            this.tasks[index] = task;
        }
    }

    findTaskById(taskId) {
        return this.tasks.find(task => task.id === taskId);
    }

    addSubtask(subtask) {
        this.subtasks.push(subtask);
    }

    removeSubtask(subtaskId) {
        const initialLength = this.subtasks.length;
        this.subtasks = this.subtasks.filter(subtask => subtask.id !== subtaskId);
        return initialLength !== this.subtasks.length;
    }
}