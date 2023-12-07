import Task 

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

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `task-${task.id}`;

        const label = document.createElement('label');
        label.htmlFor = `task-${task.id}`;
        label.textContent = task.description;

        const button = document.createElement('button');
        button.classList.add('arrow-btn');

        taskElement.appendChild(checkbox);
        taskElement.appendChild(label);
        taskElement.appendChild(button);

        document.querySelector('.todo-list').appendChild(taskElement);
    }
}