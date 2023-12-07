class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    }

    addTask(description) {
        const task = new Task(Date.now(), description);
        this.tasks.push(task);
        task.saveToLocalStorage();
        this.saveAllTasks();
        this.renderTask(task);
    }

    saveAllTasks() {
        const taskIds = this.tasks.map(task => task.id);
        localStorage.setItem('tasks', JSON.stringify(taskIds));
    }

    renderTask(task) {
        const taskElement = document.createElement('li');
        taskElement.innerHTML = `
            <input type="checkbox" id="task-${task.id}">
            <label for="task-${task.id}">${task.description}</label>
            <button class="arrow-btn"></button>
        `;
        document.querySelector('.todo-list').appendChild(taskElement);
    }
}