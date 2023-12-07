import ListManager from './ListManager.js';
import TagManager from './TagManager.js';
import DOMHelper from './DOMHelper.js';
import TaskUI from './TaskUI.js';

export default class UI {
    constructor(domHelper) {
        this.listManager = new ListManager();
        this.tagManager = new TagManager();
        this.domHelper = domHelper;
        this.rightArrowButtons = this.domHelper.querySelectorAll(".arrow-btn");
        this.todoContainer = this.domHelper.querySelector(".todo-container");
        this.taskCount = localStorage.getItem('taskCount') || 0;
        this.isInitialized = false;
    }

    setTaskManager(taskManager) {
        this.taskManager = taskManager;
        this.taskUI = new TaskUI(taskManager, this.domHelper);
    }

    initElements() {
        this.hamburger = this.domHelper.querySelector(".hamburger");
        this.leftMenuCard = this.domHelper.querySelector(".left-menu-card");
        this.rightMenuCard = this.domHelper.getElementById("right-menu-card");
        this.todoContainer = this.domHelper.querySelector(".todo-container");
        this.rightArrowButtons = this.domHelper.querySelectorAll(".arrow-btn");
        this.addListButton = this.domHelper.querySelector('.add-list');
        this.tagsMenuSelection = this.domHelper.querySelector(".Tags-menu-selection");
    }

    bindEventListeners() {
        this.todoContainer.addEventListener("click", this.expandRightMenu.bind(this));
        this.domHelper.querySelector('.close-icon').addEventListener('click', this.closeRightMenu.bind(this));
        if (this.hamburger && this.leftMenuCard && this.todoContainer) {
            this.hamburger.addEventListener("click", this.toggleMenu.bind(this));
        }
    }

    expandRightMenu(event) {
        if (!event.target.matches('.arrow-btn')) return;
        this.rightMenuCard.classList.add("expanded");
        this.todoContainer.classList.add("right-expanded");
        this.domHelper.querySelectorAll('.todo-list li').forEach(task => {
            task.classList.remove('active');
        });
        event.target.parentElement.classList.add('active');
    }

    closeRightMenu() {
        this.rightMenuCard.classList.remove('expanded');
        this.todoContainer.classList.remove('right-expanded');
    }

    updateDayOfMonth() {
        const currentDate = new Date();
        const dayOfMonth = currentDate.getDate();
        const dayOfMonthElement = this.domHelper.getElementById("dayOfMonth");
        dayOfMonthElement.textContent = dayOfMonth;
    }

    toggleMenu() {
        this.leftMenuCard.classList.toggle("expanded");
        this.todoContainer.classList.toggle("left-expanded");
        this.hamburger.classList.toggle("left-expanded");
    }

    init() {
        document.addEventListener("DOMContentLoaded", () => {
            this.updateDayOfMonth();
            this.initializeUI();
        });
    }

    renderUI() {
        this.taskManager.renderTasks();
        this.domHelper.getElementById('today-task-counter').textContent = this.taskCount;
    }

    initializeUI() {
        this.initElements();
        this.bindEventListeners();
        this.renderUI();
        this.taskUI.init();
    }
}