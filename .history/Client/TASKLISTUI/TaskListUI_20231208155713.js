// TaskListUI.js
export default class TaskListUI {
    constructor(taskManager, domHelper, ui) {
        this.taskManager = taskManager;
        this.domHelper = domHelper;
        this.ui = ui;
        this.taskListContainer = this.domHelper.querySelector('.todo-list');
    }

    // Initialize the TaskListUI, add event listeners, and render tasks
    init() {
        this.addTaskEventListener();
        this.renderTasks();
    }

    // Event listener for adding a new task
    addTaskEventListener() {
        const addTaskBtn = this.domHelper.getElementById('add-task-btn');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => {
                const taskName = this.domHelper.getElementById('new-task-input').value;
                if (taskName) {
                    // Create a new Task with the specified properties
                    const task = {
                        id: Date.now(), // Use the current timestamp as the id
                        name: taskName, // Use the value of the input field as the name
                        description: '',
                        selectedList: 'Select List',
                        selectedDueDate: 'Select Due Date',
                        selectedTags: 'Select Tag',
                        isCompleted: false,
                        subtasks: []
                    };

                    this.taskManager.createTask(task); // Add the Task to the TaskManager
                    this.renderTask(task); // Add the task to the UI
                }
            });
        }
    }

    // Render all tasks
    renderTasks() {
        const tasks = this.taskManager.getTasks();
        tasks.forEach(task => {
            this.renderTask(task);
        });
    }

    // Render a single task
    renderTask(task) {
        const taskElement = this.createTaskElement(task);
        this.taskListContainer.appendChild(taskElement);
    }

    // Create HTML elements for a task
    createTaskElement(task) {
        const taskElement = document.createElement('li');
        taskElement.setAttribute('data-task', task.id);

        // Create and add the arrow button
        const arrowButton = this.createArrowButton();
        taskElement.appendChild(arrowButton);

        const checkbox = this.createCheckbox(task);
        const label = this.createLabel(task);
        taskElement.appendChild(checkbox);
        taskElement.appendChild(label);
        return taskElement;
    }

    // Create a task's arrow button
    createArrowButton() {
        const arrowButton = document.createElement('button');
        arrowButton.className = 'arrow-btn';
        arrowButton.addEventListener('click', event => {
            event.stopPropagation(); // Prevent checkbox click event from firing
            this.ui.expandRightMenu(event);
        });
        return arrowButton;
    }

    // Create a task's checkbox
    createCheckbox(task) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `task-${task.id}`;
        return checkbox;
    }

    // Create a task's label
    createLabel(task) {
        const label = document.createElement('label');
        label.setAttribute('for', `task-${task.id}`);
        label.textContent = task.name;
        return label;
    }
}
