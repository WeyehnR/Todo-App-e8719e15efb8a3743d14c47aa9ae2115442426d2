import TaskUI from './TaskUI.js';


export default class UI {
    constructor(domHelper) {
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

    bindUIEventListeners() {
        // Get all the arrow buttons
        const arrowButtons = this.domHelper.querySelectorAll('.arrow-btn');

        // Attach a click event listener to each arrow button
        arrowButtons.forEach(button => {
            button.addEventListener('click', (event) => this.expandRightMenu(event));
        });

        // Other event listeners...
        this.domHelper.querySelector('.close-icon').addEventListener('click', this.closeRightMenu.bind(this));
        if (this.hamburger && this.leftMenuCard && this.todoContainer) {
            this.hamburger.addEventListener("click", this.toggleMenu.bind(this));
        }
    }

    expandRightMenu(event) {
        // Check if the clicked element is the arrow button
        if (!event.target.matches('.arrow-btn')) return;

        event.stopPropagation(); // Add this line

        this.rightMenuCard.classList.add("expanded");
        this.todoContainer.classList.add("right-expanded");
        this.domHelper.querySelectorAll('.todo-list li').forEach(task => {
            task.classList.remove('active');
        });
        const activeTask = event.target.parentElement;
        activeTask.classList.add('active');
        this.activeTaskId = activeTask.getAttribute('data-task');

        // Log the activeTaskId and data-task attribute
        console.log('Active task ID:', this.activeTaskId);
        console.log('Data-task attribute:', activeTask.getAttribute('data-task'));

        // Remove the existing change event listener
        const listDropdownMenu = this.domHelper.querySelector('#list-select');
        if (this.listDropdownListener) {
            listDropdownMenu.removeEventListener('change', this.listDropdownListener);
        }

        // Add a new change event listener
        this.listDropdownListener = (event) => {
            const selectedList = event.target.value;
            // Use the stored task ID
            this.taskManager.updateTaskList(this.activeTaskId, selectedList);

            // Update the _selectedList property of the active task to the selected option in the dropdown menu
            const activeTaskObject = this.taskManager.getTaskById(this.activeTaskId);
            // activeTaskObject._selectedList = selectedList; // Comment out this line
        };

        
        listDropdownMenu.addEventListener('change', this.listDropdownListener);
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

        // Update the selected list in the tasks
        this.taskManager.updateSelectedListInTasks(updatedLists[updatedLists.length - 1].name);

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

        // // Populate tags dropdown menu
        // const tagSelectElement = document.getElementById('add-tag-dropdown');
        // tagSelectElement.innerHTML = ''; // Clear the current options

        // // Create the default option
        // const defaultOption = document.createElement('option');
        // defaultOption.value = '';
        // defaultOption.textContent = 'Select Tag';
        // tagSelectElement.appendChild(defaultOption);

        // const tags = JSON.parse(localStorage.getItem('tags')) || [];
        // tags.forEach(tag => {
        //     const option = document.createElement('option');
        //     option.value = tag.text;
        //     option.textContent = tag.text;
        //     tagSelectElement.appendChild(option);
        // });
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
        this.bindUIEventListeners();
        this.renderUI();
        this.taskUI.init();
    }
}