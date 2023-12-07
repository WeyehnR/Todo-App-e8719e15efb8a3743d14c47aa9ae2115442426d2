export default class UI {
    constructor(taskManager) {
        this.taskManager = taskManager;
        this.taskCount = localStorage.getItem('taskCount') || 0;
        this.initElements();
    }

    initElements() {
        this.hamburger = this.querySelector(".hamburger");
        this.leftMenuCard = this.querySelector(".left-menu-card");
        this.rightMenuCard = this.getElementById("right-menu-card");
        this.todoContainer = this.querySelector(".todo-container");
        this.rightArrowButtons = this.querySelectorAll(".arrow-btn");
    }

    getElementById(element) {
        return document.getElementById(element);
    }

    querySelector(element) {
        return document.querySelector(element);
    }

    querySelectorAll(element) {
        return document.querySelectorAll(element);
    }

    getCurrentTaskId() {
        const activeTaskElement = this.querySelector('.todo-list li.active');
        return activeTaskElement ? activeTaskElement.getAttribute('data-task') : null;
    }

    updateTaskCounter() {
        const taskCounter = this.getElementById('today-task-counter');
        taskCounter.textContent = this.taskManager.tasks.length;
        localStorage.setItem('taskCount', this.taskManager.tasks.length);
    }

    checkTaskOverflow() {
        const todoList = this.querySelector('.todo-list');
        const method = this.taskManager.tasks.length > 5 ? 'add' : 'remove';
        todoList.classList[method]('overflow');
    }

    addTaskEventListener() {
        const addTask = () => {
            const newTaskInput = this.getElementById('new-task-input');
            const taskDescription = newTaskInput.value;
            if (taskDescription) {
                this.taskManager.addTask(taskDescription);
                this.resetNewTaskInput();
                this.taskManager.renderTasks();
                this.attachDeleteEventListeners();
            }
            this.updateTaskCounter();
            this.checkTaskOverflow();
        };

        this.getElementById('add-task-btn').addEventListener('click', addTask);
    }

    resetNewTaskInput() {
        const newTaskInput = this.getElementById('new-task-input');
        newTaskInput.value = '';
        this.querySelector('.todo-list').innerHTML = '';
    }

    addTaskClickEventListener() {
        this.querySelectorAll('.todo-list li').forEach(task => {
            task.addEventListener('click', () => {
                let taskName = task.querySelector('label').innerText;
                let taskRenameInput = this.querySelector('.task-rename');
                taskRenameInput.value = taskName;
                const taskId = task.getAttribute('data-task');
                this.loadSubtasks(taskId);
            });
            const checkbox = task.querySelector('input[type="checkbox"]');
            const label = task.querySelector('label');
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    label.classList.add('task-completed');
                } else {
                    label.classList.remove('task-completed');
                }
            });
        });
    }

    attachDeleteEventListeners() {
        this.querySelectorAll('.delete-task-button').forEach(button => {
            button.addEventListener('click', () => {
                const taskId = this.getCurrentTaskId();
                this.taskManager.deleteTask(taskId);
                this.querySelector('.todo-list').innerHTML = '';
                this.taskManager.renderTasks();
                this.updateTaskCounter();
            });
        });
        this.checkTaskOverflow();
    }

    updateDayOfMonth() {
        const currentDate = new Date();
        const dayOfMonth = currentDate.getDate();
        const dayOfMonthElement = this.getElementById("dayOfMonth");
        dayOfMonthElement.textContent = dayOfMonth;
    }

    toggleMenu() {
        this.hamburger.addEventListener("click", () => {
            this.leftMenuCard.classList.toggle("expanded");
            this.todoContainer.classList.toggle("left-expanded");
            this.hamburger.classList.toggle("left-expanded");
        });
    }

    // Remaining methods (saveSubtask, loadSubtasks, addSubtaskEventListener, etc.) unchanged

    init() {
        document.addEventListener("DOMContentLoaded", () => {
            this.updateDayOfMonth();
            this.initializeUI();
        });
    }

    initializeUI() {
        this.taskManager.renderTasks();
        this.getElementById('today-task-counter').textContent = this.taskCount;
        this.addTaskEventListener();
        this.attachDeleteEventListeners();
        this.addTaskClickEventListener();
        this.toggleMenu();
        this.displayNewListForm();
        this.setColorOptions();
        this.expandRightMenu();
        this.resetLocalStorageAndReload();
        this.closeRightMenu();
        this.toggleNewListForm();
        this.addNewList();
        this.loadLists();
        this.addNewTag();
        this.loadTags();
        this.addSubtaskEventListener();
        this.loadSubtasksForCurrentTask();
        this.populateDropdownMenus();
    }
}
