import Task from './Task.js';

export default class TaskManager {
    constructor(task = []) {
        this.tasks = task;
        // this.loadTasksFromLocalStorage();
        this.fetchTasksFromServer();
    }

    loadTasksFromLocalStorage() {
        const tasksData = JSON.parse(localStorage.getItem('tasks')) || [];
        this.tasks = tasksData.map(taskData => new Task(
            taskData.id,
            taskData.name,
            taskData.description,
            taskData.selectedList,
            taskData.selectedDueDate,
            taskData.selectedTime,
            taskData.selectedTags,
            taskData.isCompleted,
            taskData.subtasks
        ));
        console.log('Loaded Tasks: ', this.tasks);
    }

    async fetchTasksFromServer() {
        try {
            const response = await fetch('/tasks'); // Replace '/tasks' with your server's route for fetching tasks
            const tasks = await response.json();

            // Update the tasks with the fetched tasks
            this.tasks = tasks.map(taskData => new Task(
                taskData.id,
                taskData.name,
                taskData.description,
                taskData.selectedList,
                taskData.selectedDueDate,
                taskData.selectedTime,
                taskData.selectedTags,
                taskData.isCompleted,
                taskData.subtasks
            ));

            // Save the updated tasks to local storage
            this.saveTasksToLocalStorage();
        } catch (err) {
            console.error('Failed to fetch tasks from server:', err);
        }
    }

    async getTaskFromServer(taskId) {
        const response = await fetch(`/tasks/${taskId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const task = await response.json();
        return task;
    }

    saveTasksToLocalStorage() {
        const tasksJson = JSON.stringify(this.tasks);
        localStorage.setItem('tasks', tasksJson);
    }

    createTask(taskName) {
        const task = new Task(Date.now(), taskName);
        this.tasks.push(task);
        this.saveTasksToLocalStorage();
        // console.log(this.tasks); // Log the tasks
        return task;
    }

    readTask(task) {
        return task;
    }

    getTasks() {
        // console.log(this.tasks); // Log the tasks
        return this.tasks;
    }

    updateTask(task) {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index === -1) {
            throw new Error(`Task with ID ${task.id} not found`);
        }
        this.tasks.splice(index, 1, task);
    }

    clearActiveTaskId() {
        localStorage.removeItem('activeTaskId');
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

        // If the deleted task was the active task, clear the activeTaskId from local storage
        if (localStorage.getItem('activeTaskId') === String(taskId)) {
            localStorage.removeItem('activeTaskId');
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
        // console.log(this.tasks)
        // console.log(taskId)
        return this.tasks.find(task => task.id === Number(taskId));
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