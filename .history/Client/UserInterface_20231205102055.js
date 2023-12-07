// import ListManager from './ListManager.js';
import TagManager from './TagManager.js';
import DOMHelper from './DOMHelper.js';
import TaskUI from './TaskUI.js';

export default class UI {
    constructor(domHelper) {
        // this.listManager = new ListManager();
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

    updateDropdownMenu() {
        // Get the updated list from local storage
        let updatedLists = JSON.parse(localStorage.getItem('lists')) || [];
        console.log('Updated lists:', updatedLists);

        // Get the dropdown menu element
        const dropdown = document.querySelector('select');
        console.log('Dropdown menu:', dropdown);

        // Clear the dropdown menu
        while (dropdown.options.length > 0) {
            dropdown.remove(0);
        }

        // Add the updated lists to the dropdown menu
        updatedLists.forEach(list => {
            let option = document.createElement('option');
            option.text = list.name;
            dropdown.add(option);
        });

        console.log('Updated dropdown menu:', dropdown);
    }



        // Populate dropdown menus
    populateDropdownMenus() {
        // Populate lists dropdown menu
        const listSelectElement = this.domHelper.querySelector('.list select');
        listSelectElement.innerHTML = ''; // Clear the current options
        const lists = JSON.parse(localStorage.getItem('lists')) || [];
        lists.forEach(list => {
            const option = document.createElement('option');
            option.value = list.name;
            option.textContent = list.name;
            listSelectElement.appendChild(option);
        });

        // Populate tags dropdown menu
        const tagSelectElement = document.getElementById('add-tag-dropdown');
        tagSelectElement.innerHTML = ''; // Clear the current options

        // Create the default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select Tag';
        tagSelectElement.appendChild(defaultOption);

        const tags = JSON.parse(localStorage.getItem('tags')) || [];
        tags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag.text;
            option.textContent = tag.text;
            tagSelectElement.appendChild(option);
        });
    }

    init() {
        if (this.isInitialized) {
            return;
        }

        document.addEventListener("DOMContentLoaded", () => {
            this.updateDayOfMonth();
            this.initializeUI();
        });

        this.isInitialized = true;
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