export default class TaskManager {
    constructor(task = []) {
        this.tasks = [];
        this.loadTasksFromLocalStorage(); this
    }

    createTask(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        console.log(localStorage.getItem('tasks')); // Log the tasks in local storage
    }

    readTask(task) {
        return task;
    }

    getTask(taskId) {
        // Convert the taskId to a number
        taskId = Number(taskId);

        // Find and return the task with the given ID
        return this.tasks.find(task => task.id === taskId);
    }

    updateTask(task) {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index === -1) {
            throw new Error(`Task with ID ${task.id} not found`);
        }
        this.tasks.splice(index, 1, task);
    }

    deleteTask(taskId) {
        // Convert the taskId to a number
        taskId = Number(taskId);

        // Find the index of the task with the given taskId
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);

        // If the task was found, remove it from the tasks array
        if (taskIndex !== -1) {
            this.tasks.splice(taskIndex, 1);
        }
    }

    updateTaskList(taskId, selectedList) {
        // Find the task with the given ID
        const taskIdNumber = Number(taskId);
        console.log('taskId: ' + taskId);
        console.log('selectedList: ' + selectedList);
        const task = this.tasks.find(t => t.id === taskIdNumber);

        // If the task was found, update its list property
        if (task) {
            task.selectedList = selectedList;
        } else {
            throw new Error(`Task with ID ${taskId} not found`);
        }
    }

    getTasks() {
        console.log(this.tasks); // Log the tasks
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

    updateSelectedListInTasks(selectedList) {
        this.tasks.forEach(task => {
            if (task.selectedList === selectedList) {
                task.selectedList = null;
            }
        });
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