import TaskUI from '../TASKLISTUI/TaskUI.js';
import DOMHelper from '../DOMHelper/DOMHelper.js';


export default class UI {
    constructor() {
        this.domHelper = new DOMHelper();
        this.todoContainer = this.domHelper.querySelector(".todo-container");
        this.taskCount = localStorage.getItem('taskCount') || 0;
        this.isInitialized = false;
        this.eventListenersAdded = false;
        this.arrowButtonEventListeners = new Map();
    }

    setTaskManager(taskManager) {
        this.taskManager = taskManager;
        this.taskUI = new TaskUI(taskManager, this.domHelper ,this);
        // Then populate the dropdown menus
        this.populateDropdownMenus();
    }

    initElements() {
        this.hamburger = this.domHelper.querySelector(".hamburger");
        this.leftMenuCard = this.domHelper.querySelector(".left-menu-card");
        
        this.todoContainer = this.domHelper.querySelector(".todo-container");
        this.addListButton = this.domHelper.querySelector('.add-list');
        this.tagsMenuSelection = this.domHelper.querySelector(".Tags-menu-selection");
    }

    updateListDropdownMenu(activeTaskObject) {
        const listDropdownMenu = this.domHelper.querySelector('#list-select');
        if (activeTaskObject._selectedList !== 'Select List') {
            listDropdownMenu.value = activeTaskObject._selectedList;
        }
        return listDropdownMenu;
    }

    removeExistingListener(listDropdownMenu) {
        if (this.listDropdownListener) {
            listDropdownMenu.removeEventListener('change', this.listDropdownListener);
        }
    }

    addNewListener(listDropdownMenu, activeTaskObject) {
        this.listDropdownListener = (event) => {
            const selectedList = event.target.value;
            if (selectedList !== 'Select List') {
                activeTaskObject._selectedList = selectedList;
                this.taskManager.updateTaskList(this.activeTaskId, selectedList);
            }
        };
        listDropdownMenu.addEventListener('change', this.listDropdownListener);
    }
    

    updateDayOfMonth() {
        const currentDate = new Date();
        const dayOfMonth = currentDate.getDate();
        // console.log('dayOfMonth: ' + dayOfMonth);
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

        // Update the selected list in the tasks if updatedLists is not empty
        if (updatedLists.length > 0) {
            this.taskManager.updateSelectedListInTasks(updatedLists[updatedLists.length - 1].name);
        }

        console.log('Updated dropdown menu:', dropdown);
    }

    // Add this method to your UI class
    bindResetButton() {
        // Get the reset button element
        const resetButton = this.domHelper.getElementById('reset-btn');

        // Add a click event listener to the reset button
        resetButton.addEventListener('click', () => {
            // Clear local storage
            localStorage.clear();
        });
    }

        // Populate dropdown menus
    populateDropdownMenus() {
    return new Promise((resolve) => {
        // Populate lists dropdown menu
        const listSelectElement = this.domHelper.querySelector('.list select');
        
        // Clear the current options
        listSelectElement.innerHTML = '';
        
        // Create the default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select List';
        listSelectElement.appendChild(defaultOption);

        const lists = JSON.parse(localStorage.getItem('lists')) || [];
        lists.forEach(list => {
            const option = document.createElement('option');
            option.value = list.name;
            option.textContent = list.name;
            listSelectElement.appendChild(option);
        });

        // Set the value of the dropdown menu to the saved selected list
        const selectedList = localStorage.getItem('selectedList');
        if (selectedList) {
            listSelectElement.value = selectedList;
        }

        resolve();
    });
}


    init() {
        if (this.isInitialized) {
            return;
        }

        document.addEventListener("DOMContentLoaded", () => {
            this.updateDayOfMonth();
            this.populateDropdownMenus();
            this.initializeUI();
        });

        this.isInitialized = true;
    }

    renderUI() {
        // this.taskManager.renderTasks();
        this.domHelper.getElementById('today-task-counter').textContent = this.taskCount;

        // Render the task data
        const tasks = this.taskManager.getTasks();
        tasks.forEach(task => {
            // Check if the task has a selected list
            if (task._selectedList !== 'Select List') {
                // Find the task element
                const taskElement = this.domHelper.querySelector(`[data-task="${task._id}"]`);
                // Check if taskElement is not null and it contains an element with the class 'list-select'
                if (taskElement && taskElement.querySelector('.list-select')) {
                    // Update the selected list in the task element
                    taskElement.querySelector('.list-select').value = task._selectedList;
                }
            }
        });
    }

    initializeUI() {
        this.initElements();
        this.hamburger.addEventListener('click', () => {
            this.toggleMenu();
        });
        this.bindResetButton();
        this.renderUI();
    }
}