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
            console.error('No active task found');
            return null; // Return null if no active task is found
        } else {
            const taskId = activeTaskElement.getAttribute('data-task');
            console.log('Task id:', taskId);
            return taskId;
        }
    }

    updateTaskCounter() {
        const taskCounter = this.getElementById('today-task-counter');
        if (!taskCounter) {
            console.error('Task counter element not found');
            return;
        } else {
            taskCounter.textContent = this.taskManager.tasks.length;
            localStorage.setItem('taskCount', this.taskManager.tasks.length);
            console.log('Task counter:', taskCounter);
        }
    }

    checkTaskOverflow() {
        const todoList = this.querySelector('.todo-list');
        if (!todoList) {
            console.error('Todo list element not found');
            return;
        } else {
            if (this.taskManager.tasks.length > 5) {
                todoList.classList.add('overflow');
            } else {
                todoList.classList.remove('overflow');
            }
        }
    }

    addTaskEventListener() {
        const addTaskBtn = this.getElementById('add-task-btn');
        if (!addTaskBtn) {
            console.error('Add task button not found');
            return;
        } else {
            addTaskBtn.addEventListener('click', () => {
                // Event listener code remains the same
                this.updateTaskCounter();
                this.checkTaskOverflow();
            });
        }
    }

    attachDeleteEventListeners() {
        
            const buttons = this.querySelectorAll('.delete-task-button');
            if (!buttons) {
                console.log('Delete task buttons not found');
            } else {
                buttons.forEach(button => {
                    button.addEventListener('click', () => {
                        const taskId = this.getCurrentTaskId();
                        console.log(taskId);
                        this.taskManager.deleteTask(taskId);
                        this.querySelector('.todo-list').innerHTML = '';
                        this.taskManager.renderTasks();
                        this.updateTaskCounter();
                    });
                });
                this.checkTaskOverflow();
                
            }
        
    }

    updateDayOfMonth() {
        
            const currentDate = new Date();
            const dayOfMonth = currentDate.getDate();
            const dayOfMonthElement = this.getElementById("dayOfMonth");
            if (!dayOfMonthElement) {
                console.log('Day of month element not found');
            } else {
                dayOfMonthElement.textContent = dayOfMonth;
                
            }
        
    }

    toggleMenu() {
       
            if (!this.hamburger || !this.leftMenuCard || !this.todoContainer) {
                console.log('Required elements not found');
            } else {
                this.hamburger.addEventListener("click", () => {
                    this.leftMenuCard.classList.toggle("expanded");
                    this.todoContainer.classList.toggle("left-expanded");
                    this.hamburger.classList.toggle("left-expanded");
                });
                
            }
        
    }
    saveSubtask(taskId, subtask) {
       
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            let task = tasks.find(task => task.id === taskId);
            if (!task) {
                console.log('Task not found');
            } else {
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
            if (!task || !task.subtasks) {
                console.log('Task or subtasks not found');
            } else {
                const subtaskList = this.getElementById('subtask-list');
                subtaskList.innerHTML = ''; // Clear the list
                task.subtasks.forEach((subtask, index) => { // Add index here
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
                    deleteButton.addEventListener('click', () => {
                        newSubtask.remove();
                        task.subtasks.splice(index, 1);
                        localStorage.setItem('tasks', JSON.stringify(tasks));
                    });
                    newSubtask.appendChild(deleteButton);

                    subtaskList.appendChild(newSubtask);
                });
                
            }
        
    }

    addSubtaskEventListener() {
        
            const addSubtaskBtn = this.getElementById('add-subtask-btn');
            if (!addSubtaskBtn) {
                console.log('Add subtask button not found');
            } else {
                addSubtaskBtn.addEventListener('click', () => {
                    const subtaskInput = this.getElementById('new-subtask-input');
                    const subtaskList = this.getElementById('subtask-list');

                    if (subtaskInput.value) {
                        const newSubtask = document.createElement('li');

                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        newSubtask.appendChild(checkbox);

                        const label = document.createElement('label');
                        label.textContent = subtaskInput.value;
                        newSubtask.appendChild(label);

                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'X';
                        deleteButton.style.float = 'right';
                        deleteButton.addEventListener('click', () => {
                            newSubtask.remove();
                            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                            let task = tasks.find(task => task.id === this.getCurrentTaskId());
                            if (task) {
                                const subtaskIndex = task.subtasks.indexOf(label.textContent);
                                if (subtaskIndex > -1) {
                                    task.subtasks.splice(subtaskIndex, 1);
                                }
                                localStorage.setItem('tasks', JSON.stringify(tasks));
                            }
                        });
                        newSubtask.appendChild(deleteButton);

                        subtaskList.appendChild(newSubtask);
                        const taskId = this.getCurrentTaskId();
                        if (taskId) {
                            this.saveSubtask(taskId, label.textContent);
                        }
                        subtaskInput.value = '';

                        if (subtaskList.children.length > 4) {
                            subtaskList.style.height = '180px';
                            subtaskList.style.overflowY = 'scroll';
                        }
                    }
                });
                
            }
        
    }
    loadSubtasksForCurrentTask() {
       
            const taskId = this.getCurrentTaskId();
            if (!taskId) {
                console.log('No current task ID found');
            } else {
                this.loadSubtasks(taskId);
            }
        
    }

    toggleNewListForm() {
        const addListElement = this.querySelector('.add-list');
        if (!addListElement) {
            console.error('Add list element not found');
        } else {
            addListElement.addEventListener('click', () => {
                const newListForm = this.getElementById('new-list-form');
                if (!newListForm) {
                    console.error('New list form not found');
                } else {
                    newListForm.style.display = newListForm.style.display === 'block' ? 'none' : 'block';
                }
            });
        }
    }
    addNewList() {
       
            const newListNameElement = this.getElementById('new-list-name');
            if (!newListNameElement) {
                reject('New list name element not found');
            } else {
                newListNameElement.addEventListener('keypress', (event) => {
                    if (event.key === 'Enter') {
                        const newListName = event.target.value;
                        const dynamicColor = this.getElementById('dynamic-color-card').style.backgroundColor;
                        if (newListName) {
                            // Update the CSS variable with the new color
                            document.documentElement.style.setProperty('--dynamic-color-card', dynamicColor);

                            const newListElement = this.createListElement(newListName, dynamicColor);
                            const addListButton = this.querySelector('.add-list');
                            addListButton.parentNode.insertBefore(newListElement, addListButton);
                            event.target.value = '';
                            this.getElementById('new-list-form').style.display = 'none';

                            // Store the new list name and color in localStorage
                            let lists = JSON.parse(localStorage.getItem('lists')) || [];
                            lists.push({ name: newListName, color: dynamicColor });
                            localStorage.setItem('lists', JSON.stringify(lists));

                            // Update the dropdown menu
                            this.populateDropdownMenu();
                        }
                    }
                });
                
            }
        
    }

    loadLists() {
        
            let lists = JSON.parse(localStorage.getItem('lists')) || [];
            if (!lists) {
                reject('No lists found');
            } else {
                lists.forEach(list => {
                    const newListElement = this.createListElement(list.name, list.color);
                    const addListButton = this.querySelector('.add-list');
                    addListButton.parentNode.insertBefore(newListElement, addListButton);
                });
                
            }
        
    }
    createListElement(name, color) {
       
            const newListElement = document.createElement('li');
            if (!newListElement) {
                reject('Unable to create list element');
            } else {
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
                });

                resolve(newListElement);
            }
        
    }

    // Add list
    addList(name, color) {
       
            let lists = JSON.parse(localStorage.getItem('lists')) || [];
            lists.push({name: name, color: color});
            localStorage.setItem('lists', JSON.stringify(lists));
            this.populateDropdownMenu() // Update the dropdown menu
                
        
    }

    // Delete list
    deleteList(name) {

            // Remove the list from local storage
            let lists = JSON.parse(localStorage.getItem('lists')) || [];
            const index = lists.findIndex(list => list.name === name);
            if (index !== -1) {
                lists.splice(index, 1);
                localStorage.setItem('lists', JSON.stringify(lists));
            }
            this.populateDropdownMenu() // Update the dropdown menu
                
        
    }

    populateDropdownMenus() {
        
            // Populate lists dropdown menu
            const listSelectElement = this.querySelector('.list select');
            const tagSelectElement = document.getElementById('add-tag-dropdown');
            if (!listSelectElement || !tagSelectElement) {
                reject('Dropdown menu elements not found');
            } else {
                listSelectElement.innerHTML = ''; // Clear the current options
                const lists = JSON.parse(localStorage.getItem('lists')) || [];
                lists.forEach(list => {
                    const option = document.createElement('option');
                    option.value = list.name;
                    option.textContent = list.name;
                    listSelectElement.appendChild(option);
                });
    
                // Populate tags dropdown menu
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
        
    }
    
    getContrast(rgbColor) {
        
            const [r, g, b] = rgbColor.match(/\d+/g).map(Number);
            if (!r || !g || !b) {
                reject('Invalid RGB color');
            } else {
                resolve((r * 0.299 + g * 0.587 + b * 0.114) > 186 ? 'black' : 'white');
            }
        
    }
    
    getRandomColor() {
       
            let r, g, b;
            let contrast;
            do {
                r = Math.floor(Math.random() * 128) + 128;
                g = Math.floor(Math.random() * 128) + 128;
                b = Math.floor(Math.random() * 128) + 128;
                this.getContrast(`rgb(${r}, ${g}, ${b})`);
            } while (contrast === 'black'); // repeat until a light enough color is found
        
    }
    
    addNewTag() {
        
            const addTagButton = this.querySelector('.add-tag');
            const tagDropdown = this.getElementById('add-tag-dropdown');
            if (!addTagButton || !tagDropdown) {
                reject('Add tag button or dropdown not found');
            } else {
                addTagButton.addEventListener('click', () => {
                    const newTag = this.createTagElement(`Tag ${this.querySelectorAll('.tag').length + 1}`, this.getRandomColor());
                    addTagButton.parentNode.insertBefore(newTag, addTagButton);
                    this.saveTags();
                });
    
                tagDropdown.addEventListener('change', (event) => {
                    const newTag = this.createTagElement(event.target.value, this.getRandomColor());
                    addTagButton.parentNode.insertBefore(newTag, addTagButton);
                    this.saveTags();
                });
                
            }
        
    }

    // Add tag
    addTag(tagText, tagColor) {
        
            const addTagBtn = this.getElementById('add-tag-btn');
            if (!addTagBtn) {
                reject('Add tag button not found');
            } else {
                addTagBtn.addEventListener('click', () => {
                    let tags = JSON.parse(localStorage.getItem('tags')) || [];
                    tags.push({text: tagText, bgColor: tagColor});
                    localStorage.setItem('tags', JSON.stringify(tags));

                    // Update the dropdown menus
                    this.populateDropdownMenus()
                        .then(() => resolve())
                        .catch(error => reject(error));
                });
            }
    }

    // Delete tag
    deleteTag(tagText) {
       
            const deleteTagBtn = this.getElementById('delete-tag-btn');
            if (!deleteTagBtn) {
                reject('Delete tag button not found');
            } else {
                deleteTagBtn.addEventListener('click', () => {
                    let tags = JSON.parse(localStorage.getItem('tags')) || [];
                    const index = tags.findIndex(tag => tag.text === tagText);
                    if (index !== -1) {
                        tags.splice(index, 1);
                        localStorage.setItem('tags', JSON.stringify(tags));
                    }

                    // Update the dropdown menus
                    this.populateDropdownMenus()
                        .then(() => resolve())
                        .catch(error => reject(error));
                });
            }
        
    }

    // Rename tag
    renameTag(oldTagText, newTagText) {
        
            const renameTagBtn = this.getElementById('rename-tag-btn');
            if (!renameTagBtn) {
                reject('Rename tag button not found');
            } else {
                renameTagBtn.addEventListener('click', () => {
                    let tags = JSON.parse(localStorage.getItem('tags')) || [];
                    const index = tags.findIndex(tag => tag.text === oldTagText);
                    if (index !== -1) {
                        tags[index].text = newTagText;
                        localStorage.setItem('tags', JSON.stringify(tags));
                    }

                    // Update the dropdown menus
                    this.populateDropdownMenus()
                        .then(() => resolve())
                        .catch(error => reject(error));
                });
            }
        
    }

    loadTags() {
        
            const tags = JSON.parse(localStorage.getItem('tags') || '[]');
            if (!tags) {
                reject('No tags found');
            } else {
                tags.forEach(tag => {
                    this.createTagElement(tag.text, tag.bgColor)
                        .then(newTag => {
                            const addTagButton = this.querySelector('.add-tag');
                            if (!addTagButton) {
                                reject('Add tag button not found');
                            } else {
                                addTagButton.parentNode.insertBefore(newTag, addTagButton);
                            }
                        })
                        .catch(error => reject(error));
                });
                
            }
        
    }

    createTagElement(text, bgColor) {
       
            const newTag = document.createElement('li');
            if (!newTag) {
                reject('Unable to create tag element');
            } else {
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
                    });

                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            input.blur();
                        }
                    });
                });

                resolve(newTag);
            }
        
    }
    saveTags() {
            const tags = Array.from(this.querySelectorAll('.tag')).map(tag => ({
                text: tag.querySelector('.tag-text').textContent,
                bgColor: tag.style.backgroundColor
            }));
            localStorage.setItem('tags', JSON.stringify(tags));
            
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
        
            const resetBtn = this.getElementById('reset-btn');
            if (!resetBtn) {
                reject('Reset button not found');
            } else {
                resetBtn.addEventListener('click', () => {
                    localStorage.clear();
                    location.reload();
                    
                });
            }
    }

    closeRightMenu() {
        
            const closeIcon = this.querySelector('.close-icon');
            if (!closeIcon) {
                reject('Close icon not found');
            } else {
                closeIcon.addEventListener('click', () => {
                    this.rightMenuCard.classList.remove('expanded');
                    this.todoContainer.classList.remove('right-expanded');
                    
                });
            }
        
    }

    displayNewListForm() {
        
            const newListForm = this.getElementById('new-list-form');
            if (!newListForm) {
                reject('New list form not found');
            } else {
                newListForm.addEventListener('click', () => {
                    newListForm.style.display = 'block';
                    
                });
            }
        
    }

    init() {
        document.addEventListener("DOMContentLoaded", async () => {
            try {
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
                 this.loadTags();
                 this.addSubtaskEventListener();
                 this.loadSubtasksForCurrentTask();
                 this.populateDropdownMenus();
            } catch (error) {
                console.error(error);
            }
        });
    }
    
}