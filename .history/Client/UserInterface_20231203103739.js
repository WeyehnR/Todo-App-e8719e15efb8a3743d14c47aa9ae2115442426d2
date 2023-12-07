import ListManager from './ListManager.js';
import TagManager from './TagManager.js';
import DOMHelper from './DOMHelper.js';
import TaskUI from './TaskUI.js';

export default class UI {
    constructor(domHelper) {
        this.listManager = new ListManager();
        this.tagManager = new TagManager();
        this.domHelper = new DOMHelper();
        this.taskCount = localStorage.getItem('taskCount') || 0;
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
    

    expandRightMenu() {
        this.rightArrowButtons.forEach(button => {
            button.addEventListener("click", () => {
                console.log("Right arrow button clicked!")
                this.rightMenuCard.classList.add("expanded");
                this.todoContainer.classList.add("right-expanded");
                this.domHelper.querySelectorAll('.todo-list li').forEach(task => {
                    task.classList.remove('active');
                });
                button.parentElement.classList.add('active');
            });
        });
    }

    closeRightMenu() {
        this.domHelper.querySelector('.close-icon').addEventListener('click', () => {
            this.rightMenuCard.classList.remove('expanded');
            this.todoContainer.classList.remove('right-expanded');
        });
    }

    updateDayOfMonth() {
        const currentDate = new Date();
        const dayOfMonth = currentDate.getDate();
        const dayOfMonthElement = this.domHelper.getElementById("dayOfMonth");
        dayOfMonthElement.textContent = dayOfMonth;
    }

    toggleMenu() {
        if (this.hamburger && this.leftMenuCard && this.todoContainer) {
            this.hamburger.addEventListener("click", () => {
                this.leftMenuCard.classList.toggle("expanded");
                this.todoContainer.classList.toggle("left-expanded");
                this.hamburger.classList.toggle("left-expanded");
            });
        }
    }

    resetLocalStorageAndReload() {
        this.domHelper.getElementById('reset-btn').addEventListener('click', () => {
            localStorage.clear();
            location.reload();
        });
    }

    saveSubtask(taskId, subtask) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        let task = tasks.find(task => task.id === taskId);
        if (task) {
            if (!task.subtasks) {
                task.subtasks = [];
            }
            task.subtasks.push(subtask);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    loadSubtasks(taskId) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        let task = tasks.find(task => task.id === taskId);
        if (task && task.subtasks) {
            const subtaskList = this.domHelper.getElementById('subtask-list');
            subtaskList.innerHTML = '';
            task.subtasks.forEach((subtask, index) => {
                const newSubtask = this.createSubtaskElement(subtask);
                newSubtask.domHelper.querySelector('button').addEventListener('click', () => {
                    newSubtask.remove();
                    task.subtasks.splice(index, 1);
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                });
                subtaskList.appendChild(newSubtask);
            });
        }
    }

    createSubtaskElement(subtask) {
        const newSubtask = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        newSubtask.appendChild(checkbox);
        const label = document.createElement('label');
        label.textContent = subtask;
        newSubtask.appendChild(label);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.style.float = 'right';
        newSubtask.appendChild(deleteButton);
        return newSubtask;
    }

    addSubtaskEventListener() {
        const addSubtaskBtn = this.domHelper.getElementById('add-subtask-btn');
        if (addSubtaskBtn) {
            addSubtaskBtn.addEventListener('click', () => {
                const subtaskInput = this.domHelper.getElementById('new-subtask-input');
                const subtaskList = this.domHelper.getElementById('subtask-list');
                const subtask = subtaskInput.value;
                if (subtask) {
                    const newSubtask = this.createSubtaskElement(subtask);
                    newSubtask.querySelector('button').addEventListener('click', () => {
                        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                        let task = tasks.find(t => t.id === this.getCurrentTaskId());
                        if (task) {
                            const subtaskIndex = task.subtasks.indexOf(subtask);
                            if (subtaskIndex > -1) {
                                task.subtasks.splice(subtaskIndex, 1);
                            }
                            localStorage.setItem('tasks', JSON.stringify(tasks));
                        }
                        newSubtask.remove();
                    });
                    subtaskList.appendChild(newSubtask);
                    subtaskInput.value = '';
                    const taskId = this.getCurrentTaskId();
                    if (taskId) {
                        this.saveSubtask(taskId, subtask);
                    }
                }
            });
        }
    }

    // Load subtasks for current task
    loadSubtasksForCurrentTask() {
        const taskId = this.getCurrentTaskId();
        if (taskId) {
            this.loadSubtasks(taskId);
        }
    }

    addListButtonEvent() {
        this.addListButton.addEventListener('click', () => {
            if (this.tagsMenuSelection.style.display === "none") {
                this.tagsMenuSelection.style.display = "block";
            } else {
                this.tagsMenuSelection.style.display = "none";
            }
        });
    }

    displayNewListForm() {
        this.domHelper.getElementById('new-list-form').addEventListener('click', () => {
            this.domHelper.getElementById('new-list-form').style.display = 'block';
        });
    }

    setColorOptions() {
        const colorOptions = this.domHelper.querySelectorAll('.color-option-1, .color-option-2, .color-option-3, .color-option-4, .color-option-5, .color-option-6, .color-option-7, .color-option-8');
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                const color = window.getComputedStyle(option).backgroundColor;
                this.domHelper.getElementById('dynamic-color-card').style.backgroundColor = color;
            });
        });
    }

    

    toggleNewListForm() {
        const addListElement = this.domHelper.querySelector('.add-list');
        if (!addListElement) {
            console.error('Add list element not found');
        } else {
            console.log('Add list element found, adding event listener');
            addListElement.addEventListener('click', () => {
                const newListForm = this.domHelper.getElementById('new-list-form');
                if (!newListForm) {
                    console.error('New list form not found');
                } else {
                    console.log('New list form found, toggling display');
                    newListForm.style.display = newListForm.style.display === 'block' ? 'none' : 'block';
                }
            });
        }
    }

    addNewList() {
        this.domHelper.getElementById('new-list-name').addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                const newListName = event.target.value;
                const dynamicColor = this.domHelper.getElementById('dynamic-color-card').style.backgroundColor;
                if (newListName) {
                    // Update the CSS variable with the new color
                    document.documentElement.style.setProperty('--dynamic-color-card', dynamicColor);

                    const newListElement = this.createListElement(newListName, dynamicColor);
                    const ul = this.domHelper.querySelector('.Lists-menu-selection');
                    ul.appendChild(newListElement);
                    event.target.value = '';
                    this.domHelper.getElementById('new-list-form').style.display = 'none';

                    // Store the new list name and color in localStorage
                    let lists = JSON.parse(localStorage.getItem('lists')) || [];
                    lists.push({ name: newListName, color: dynamicColor });
                    localStorage.setItem('lists', JSON.stringify(lists));

                    // Update the dropdown menu
                    this.populateDropdownMenus();
                }
            }
        });
    }

    createListElement(name, color) {
        const newListElement = document.createElement('li');
        newListElement.className = 'menu-item new-list';

        const listName = document.createTextNode(name);
        newListElement.appendChild(listName);

        const itemCount = document.createElement('span');
        itemCount.className = 'item-count';
        newListElement.appendChild(itemCount);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-list';
        deleteButton.textContent = 'x';
        newListElement.appendChild(deleteButton);

        newListElement.style.setProperty('--dynamic-color-card', color);

        // Add event listener to delete button
        deleteButton.addEventListener('click', () => {
            newListElement.remove();
            // Update localStorage
            let lists = JSON.parse(localStorage.getItem('lists')) || [];
            lists = lists.filter(list => list.name !== name);
            localStorage.setItem('lists', JSON.stringify(lists));

            // Update the dropdown menu
            this.updateDropdownMenu();
        });

        return newListElement;
    }
    

    loadLists() {
        let lists = JSON.parse(localStorage.getItem('lists')) || [];
        lists.forEach(list => {
            const newListElement = this.createListElement(list.name, list.color);
            const addListButton = this.domHelper.querySelector('.add-list');
            addListButton.parentNode.insertBefore(newListElement, addListButton);
        });
    }

    addDeleteButtonListeners() {
        const deleteButtons = document.querySelectorAll('.Lists-menu-selection .delete-list');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                // Get the name of the list to delete
                const name = event.target.parentElement.textContent.trim();
                this.deleteList(name);
                console.log(name);
            });
        });
    }


    //TAGS SECTION

    addNewTag() {
        this.domHelper.querySelector('.add-tag').addEventListener('click', () => {
            const newTag = this.createTagElement(`Tag ${this.domHelper.querySelectorAll('.tag').length + 1}`, this.getRandomColor());
            const ul = this.domHelper.querySelector('.Tags-menu-selection');
            ul.appendChild(newTag);
            this.saveTags();
            this.updateTagDropdownMenu();
        });

        this.domHelper.getElementById('add-tag-dropdown').addEventListener('change', (event) => {
            const newTag = this.createTagElement(event.target.value, this.getRandomColor());
            const ul = this.domHelper.querySelector('.Tags-menu-selection');
            ul.appendChild(newTag);
            this.saveTags();
        });
    }

    // Add tag
    addTag() {
        this.domHelper.getElementById('add-tag-btn').addEventListener('click', () => {
            // Assume you get tagText and tagColor from input fields
            let tags = JSON.parse(localStorage.getItem('tags')) || [];
            tags.push({text: tagText, bgColor: tagColor});
            localStorage.setItem('tags', JSON.stringify(tags));

            // Update the dropdown menus
            this.populateDropdownMenus();
        });
    }

    // Delete tag
    deleteTag() {
        this.domHelper.getElementById('delete-tag-btn').addEventListener('click', () => {
            // Assume you get tagText from an input field
            let tags = JSON.parse(localStorage.getItem('tags')) || [];
            const index = tags.findIndex(tag => tag.text === tagText);
            if (index !== -1) {
                tags.splice(index, 1);
                localStorage.setItem('tags', JSON.stringify(tags));
            }

            // Update the dropdown menus
            this.populateDropdownMenus();
        });
    }

    // Rename tag
    renameTag() {
        this.domHelper.getElementById('rename-tag-btn').addEventListener('click', () => {
            // Assume you get oldTagText and newTagText from input fields
            let tags = JSON.parse(localStorage.getItem('tags')) || [];
            const index = tags.findIndex(tag => tag.text === oldTagText);
            if (index !== -1) {
                tags[index].text = newTagText;
                localStorage.setItem('tags', JSON.stringify(tags));
            }

            // Update the dropdown menus
            this.populateDropdownMenus();
        });
    }

    getContrast(rgbColor) {
        const [r, g, b] = rgbColor.match(/\d+/g).map(Number);
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? 'black' : 'white';
    }

    getRandomColor() {
        let r, g, b;
        let contrast;
        do {
            r = Math.floor(Math.random() * 128) + 128;
            g = Math.floor(Math.random() * 128) + 128;
            b = Math.floor(Math.random() * 128) + 128;
            contrast = this.getContrast(`rgb(${r}, ${g}, ${b})`);
        } while (contrast === 'black'); // repeat until a light enough color is found
        return `rgb(${r}, ${g}, ${b})`;
    }

    createTagElement(text, bgColor) {
        const newTag = document.createElement('li');
        newTag.className = 'menu-item tag';
        newTag.style.backgroundColor = bgColor;
        newTag.style.color = 'black';

        const tagText = document.createElement('span');
        tagText.className = 'tag-text';
        tagText.textContent = text;
        newTag.appendChild(tagText);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-tag';
        deleteButton.style.backgroundColor = bgColor;
        deleteButton.textContent = 'x';
        newTag.appendChild(deleteButton);

        // Add event listener to delete button
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            newTag.remove();
            this.saveTags();

            // Update the dropdown menu
            this.updateTagDropdownMenu();
        });

        // Add event listener to tag for editing
        tagText.addEventListener('click', (e) => {
            e.stopPropagation();
            const input = document.createElement('input');
            input.value = e.target.textContent;
            e.target.textContent = '';
            e.target.appendChild(input);
            input.focus();

            input.addEventListener('blur', () => {
                e.target.textContent = input.value;
                this.saveTags();

                // Update the dropdown menu
                this.updateTagDropdownMenu();
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    input.blur();
                    this.updateTagDropdownMenu();
                }
            });
        });

        return newTag;
    }


    saveTags() {
        const tags = Array.from(this.domHelper.querySelectorAll('.tag')).map(tag => ({
            text: tag.querySelector('.tag-text').textContent,
            bgColor: tag.style.backgroundColor
        }));
        localStorage.setItem('tags', JSON.stringify(tags));
    }


    loadTags() {
        const tags = JSON.parse(localStorage.getItem('tags') || '[]');
        tags.forEach(tag => {
            const newTag = this.createTagElement(tag.text, tag.bgColor);
            const addTagButton = this.domHelper.querySelector('.add-tag');
            addTagButton.parentNode.insertBefore(newTag, addTagButton);
        });
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

    updateTagDropdownMenu() {
        // Get the updated tags from local storage
        let updatedTags = JSON.parse(localStorage.getItem('tags')) || [];
        console.log('Updated tags:', updatedTags);

        // Get the tag dropdown menu element
        const dropdown = document.querySelector('#add-tag-dropdown');
        console.log('Tag dropdown menu:', dropdown);

        // Clear the tag dropdown menu
        while (dropdown.options.length > 1) {                
            dropdown.remove(1);
        } 

        // Add the updated tags to the tag dropdown menu
        updatedTags.forEach(tag => {
            let option = document.createElement('option');
            option.text = tag.text;
            option.value = tag.text;
            dropdown.add(option);
        });

        console.log('Updated tag dropdown menu:', dropdown);
    }


    init() {
        document.addEventListener("DOMContentLoaded", () => {
            this.updateDayOfMonth();
            this.initializeUI();
        });
    }

    initializeUI() {
        this.taskManager.renderTasks();
        this.domHelper.getElementById('today-task-counter').textContent = this.taskCount;
        this.initElements();
        this.expandRightMenu();
        this.closeRightMenu();
        this.taskUI.init();
    }
}
