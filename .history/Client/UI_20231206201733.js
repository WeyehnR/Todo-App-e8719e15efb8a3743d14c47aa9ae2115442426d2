import TaskUI from './TaskUI.js';


export default class UI {
    constructor(domHelper) {
        this.domHelper = domHelper;
        this.todoContainer = this.domHelper.querySelector(".todo-container");
        this.taskCount = localStorage.getItem('taskCount') || 0;
        this.isInitialized = false;
        this.eventListenersAdded = false;
        this.arrowButtonEventListeners = new Map();
    }

    setTaskManager(taskManager) {
        this.taskManager = taskManager;
        this.taskUI = new TaskUI(taskManager, this.domHelper ,this);
        // Load the lists from local storage
        // this.taskManager.loadListsFromLocalStorage();

        // Then populate the dropdown menus
        this.populateDropdownMenus();
    }

    initElements() {
        this.hamburger = this.domHelper.querySelector(".hamburger");
        this.leftMenuCard = this.domHelper.querySelector(".left-menu-card");
        this.rightMenuCard = this.domHelper.getElementById("right-menu-card");
        this.todoContainer = this.domHelper.querySelector(".todo-container");
        this.addListButton = this.domHelper.querySelector('.add-list');
        this.tagsMenuSelection = this.domHelper.querySelector(".Tags-menu-selection");
    }

    bindUIEventListeners() {
        // Add new event listeners
        const arrowButtons = Array.from(this.domHelper.querySelectorAll('.arrow-btn'));
        arrowButtons.forEach(button => {
            // Only add the event listener if it hasn't been added before
            if (!this.arrowButtonEventListeners.has(button)) {
                const eventListener = (event) => this.expandRightMenu(event);
                console.log('Adding event listener to:', button);
                button.addEventListener('click', eventListener);
                this.arrowButtonEventListeners.set(button, eventListener);
            }
        });

        // Other event listeners...
        this.domHelper.querySelector('.close-icon').addEventListener('click', this.closeRightMenu.bind(this));
        if (this.hamburger && this.leftMenuCard && this.todoContainer) {
            this.hamburger.addEventListener("click", this.toggleMenu.bind(this));
        }

        this.eventListenersAdded = true;
    }

    toggleRightMenu() {
        this.rightMenuCard.classList.add("expanded");
        this.todoContainer.classList.add("right-expanded");
    }

    deactivateTasks() {
        this.domHelper.querySelectorAll('.todo-list li').forEach(task => {
            task.classList.remove('active');
        });
    }

    activateTask(taskElement) {
        taskElement.classList.add('active');
        this.activeTaskId = taskElement.getAttribute('data-task');
    }

    getActiveTaskObject() {
        return this.taskManager.findTaskById(this.activeTaskId);
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

    expandRightMenu(event) {
        console.log('expandRightMenu called');
        if (!event.target.matches('.arrow-btn')) return;
        event.stopPropagation();

        this.toggleRightMenu();
        this.deactivateTasks();
        const activeTask = event.target.parentElement;
        this.activateTask(activeTask);

        // Get the active task object
        const activeTaskObject = this.getActiveTaskObject();
        console.log('Active task object:', activeTaskObject);

        // Check if the active task object is defined
        if (activeTaskObject) {
            // Update the task manager with the active task
            this.taskManager.setTask(activeTaskObject);
        } else {
            console.error('Active task object is undefined');
        }

        const listDropdownMenu = this.updateListDropdownMenu(activeTaskObject);

        this.removeExistingListener(listDropdownMenu);
        this.addNewListener(listDropdownMenu, activeTaskObject);
    }

    closeRightMenu() {
        this.rightMenuCard.classList.remove('expanded');
        this.todoContainer.classList.remove('right-expanded');
        this.todoContainer.style.width = 'calc(100% - 5%)'; // Reset the width of the todo-container
        // Hide the right menu card
        this.rightMenuCard.style.display = 'none';
    }

    updateDayOfMonth() {
        const currentDate = new Date();
        const dayOfMonth = currentDate.getDate();
        console.log('dayOfMonth: ' + dayOfMonth);
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

        // Save the selected list to local storage when the user selects a list
        listSelectElement.addEventListener('change', (event) => {
            localStorage.setItem('selectedList', event.target.value);
        });

        // Save all the options to local storage
        const options = Array.from(listSelectElement.options).map(option => option.value);
        localStorage.setItem('options', JSON.stringify(options));
        
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
        this.bindUIEventListeners();
        this.renderUI();
        // this.taskUI.init();
    }
}