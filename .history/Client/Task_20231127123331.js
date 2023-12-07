// Define the Task class
class Task {
    constructor(id, description, isCompleted = false, subtasks = []) {
        this.id = id;
        this.description = description;
        this.isCompleted = isCompleted;
        this.subtasks = subtasks;
    }

    toggleComplete() {
        this.isCompleted = !this.isCompleted;
    }

    addSubtask(subtask) {
        this.subtasks.push(subtask);
    }

    removeSubtask(subtaskId) {
        this.subtasks = this.subtasks.filter(subtask => subtask.id !== subtaskId);
    }
}

// Initialize an empty array to store tasks
let tasks = [];

// Event handler for the "Add Task" button
document.getElementById('add-task-btn').addEventListener('click', function() {
    // Get the task description from the input field
    let taskDescription = document.getElementById('new-task-input').value;

    // Create a new task object
    let task = new Task(Date.now(), taskDescription);

    // Add the task to the tasks array
    tasks.push(task);

    // Add the task to the UI
    let taskElement = document.createElement('li');
    taskElement.innerHTML = `
        <input type="checkbox" id="task-${task.id}">
        <label for="task-${task.id}">${task.description}</label>
        <button class="arrow-btn"></button>
    `;
    document.querySelector('.todo-list').appendChild(taskElement);

    // Clear the input field
    document.getElementById('new-task-input').value = '';
});