export default class UI {
    constructor(taskManager) {
        this.taskManager = taskManager;
        this.taskCount = localStorage.getItem('taskCount') || 0;
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
        if (!activeTaskElement) {
            return null;
        }
        const taskId = activeTaskElement.getAttribute('data-task');
        console.log('Task id:', taskId);
        return taskId;
    }

    updateTaskCounter() {
        const taskCounter = this.getElementById('today-task-counter');
        taskCounter.textContent = this.taskManager.tasks.length;
        localStorage.setItem('taskCount', this.taskManager.tasks.length);
        console.log('Task counter:', taskCounter);
    }

    addTaskEventListener() {
        this.getElementById('add-task-btn').addEventListener('click', () => {
            const newTaskInput = this.getElementById('new-task-input');
            const taskDescription = newTaskInput.value;
            if (taskDescription) {
                this.taskManager.addTask(taskDescription);
                newTaskInput.value = '';
                this.querySelector('.todo-list').innerHTML = '';
                this.taskManager.renderTasks();
                this.attachDeleteEventListeners();
            }
            this.updateTaskCounter();
        });
    }

    addTaskClickEventListener() {
        this.querySelectorAll('.todo-list li').forEach(task => {
            task.addEventListener('click', () => {
                let taskName = task.querySelector('label').innerText;
                let taskRenameInput = this.querySelector('.task-rename');
                taskRenameInput.value = taskName;
            });
        });
    }

    attachDeleteEventListeners() {
        this.querySelectorAll('.delete-task-button').forEach(button => {
            button.addEventListener('click', () => {
                const taskId = this.getCurrentTaskId();
                console.log(taskId);
                this.taskManager.deleteTask(taskId);
                this.querySelector('.todo-list').innerHTML = '';
                this.taskManager.renderTasks();
                this.updateTaskCounter();
            });
        });
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

    toggleNewListForm() {
        this.querySelector('.add-list').addEventListener('click', () => {
            const newListForm = this.getElementById('new-list-form');
            newListForm.style.display = newListForm.style.display === 'block' ? 'none' : 'block';
        });
    }

    addNewList() {
        this.getElementById('new-list-name').addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                const newListName = event.target.value;
                const dynamicColor = this.getElementById('dynamic-color-card').style.backgroundColor;
                if (newListName) {
                    // Update the CSS variable with the new color
                    document.documentElement.style.setProperty('--dynamic-color-card', dynamicColor);

                    const newListElement = document.createElement('li');
                    newListElement.className = 'menu-item new-list';
                    newListElement.innerHTML = `${newListName}<span class="item-count"></span><button class="delete-list">x</button>`;
                    const addListButton = this.querySelector('.add-list');
                    addListButton.parentNode.insertBefore(newListElement, addListButton);
                    event.target.value = '';
                    this.getElementById('new-list-form').style.display = 'none';

                    // Store the new list name and color in localStorage
                    let lists = JSON.parse(localStorage.getItem('lists')) || [];
                    lists.push({ name: newListName, color: dynamicColor });
                    localStorage.setItem('lists', JSON.stringify(lists));

                    // Add event listener to delete button
                    newListElement.querySelector('.delete-list').addEventListener('click', () => {
                        newListElement.remove();
                        // Update localStorage
                        lists = lists.filter(list => list.name !== newListName);
                        localStorage.setItem('lists', JSON.stringify(lists));
                    });
                }
            }
        });
    }

    loadLists() {
        let lists = JSON.parse(localStorage.getItem('lists')) || [];
        lists.forEach(list => {
            const newListElement = document.createElement('li');
            newListElement.className = 'menu-item new-list';
            newListElement.innerHTML = `${list.name}<span class="item-count"></span><button class="delete-list">x</button>`;
            newListElement.style.setProperty('--dynamic-color-card', list.color);
            const addListButton = this.querySelector('.add-list');
            addListButton.parentNode.insertBefore(newListElement, addListButton);

            // Add event listener to delete button
            newListElement.querySelector('.delete-list').addEventListener('click', () => {
                newListElement.remove();
                // Update localStorage
                lists = lists.filter(item => item.name !== list.name);
                localStorage.setItem('lists', JSON.stringify(lists));
            });
        });
    }
   


    /**
     * <ul class="Tags-menu-selection">
            <li class="menu-item tag1">Tag 1</li>
            <li class="menu-item tag2">Tag 2</li>
            <li class="menu-item add-tag">+ Add Tag</li>
        </ul>

        Create a function called addNewTag() that will add a new tag to the list of tags.
        each time the user click on + add Tag button, a new tag will be added to the list name "Tag #" (# is the number after tag 2)with the color
        randomly generated.
     */
    getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }

    addNewTag() {
        this.querySelector('.add-tag').addEventListener('click', () => {
            const newTag = document.createElement('li');
            newTag.className = 'menu-item tag';
            newTag.innerHTML = `Tag ${this.querySelectorAll('.tag').length + 1}`;
            newTag.style.backgroundColor = this.getRandomColor();
            const addTagButton = this.querySelector('.add-tag');
            addTagButton.parentNode.insertBefore(newTag, addTagButton);
        });
    }

    setColorOptions() {
        const colorOptions = this.querySelectorAll('.color-option-1, .color-option-2, .color-option-3, .color-option-4, .color-option-5, .color-option-6, .color-option-7, .color-option-8');
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                const color = window.getComputedStyle(option).backgroundColor;
                this.getElementById('dynamic-color-card').style.backgroundColor = color;
            });
        });
    }

    expandRightMenu() {
        this.rightArrowButtons.forEach(button => {
            button.addEventListener("click", () => {
                this.rightMenuCard.classList.add("expanded");
                this.todoContainer.classList.add("right-expanded");
                this.querySelectorAll('.todo-list li').forEach(task => {
                    task.classList.remove('active');
                });
                button.parentElement.classList.add('active');
            });
        });
    }

    resetLocalStorageAndReload() {
        this.getElementById('reset-btn').addEventListener('click', () => {
            localStorage.clear();
            location.reload();
        });
    }

    closeRightMenu() {
        this.querySelector('.close-icon').addEventListener('click', () => {
            this.rightMenuCard.classList.remove('expanded');
            this.todoContainer.classList.remove('right-expanded');
        });
    }

    displayNewListForm() {
        this.getElementById('new-list-form').addEventListener('click', () => {
            this.getElementById('new-list-form').style.display = 'block';
        });
    }

    init() {
        document.addEventListener("DOMContentLoaded", () => {
            this.updateDayOfMonth();
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
        });
    }
    
}