import Task from './Task.js';

class TaskManager {
    constructor() {
        this.tasks = this.loadTasksFromLocalStorage();
    }

    addTask(description) {
        
        if (description === undefined || description === null) {
            console.error('Description must not be undefined or null');
            return;
        }

        const id = new Date().getTime().toString();  // Use timestamp as id
        const isCompleted = false;  // Default value
        const subtasks = [];  // Default value
        const task = new Task(id, description, isCompleted, subtasks);
        console.log("Adding Task", task);
        console.log(task);
        this.tasks.push(task);

       
        this.saveAllTasks();
        return task;
    }

   

    deleteTask(id){

        console.log('Deleting task with id:', id);  // Log the id of the task to delete

        console.log('Task ids:', this.tasks.map(task => task.id));

        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1)
        {
            console.error('Task not found');
            return;
        }

        this.tasks.splice(taskIndex, 1);

        this.saveAllTasks();

        const taskElement = document.getElementById(`task-${id}`);
        if (taskElement) {
            taskElement.remove();
        }
    }

    saveAllTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
    
  

    loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        return tasks.map(taskObj => new Task(taskObj.id, taskObj.description, taskObj.isCompleted, taskObj.subtasks));
    }


    
   
}

export default TaskManager;