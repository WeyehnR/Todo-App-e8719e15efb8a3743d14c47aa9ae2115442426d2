// export default class UI {
//     constructor(taskManager) {
//         this.taskManager = taskManager;
//         this.taskCount = localStorage.getItem('taskCount') || 0;
//         this.hamburger = this.querySelector(".hamburger");
//         this.leftMenuCard = this.querySelector(".left-menu-card");
//         this.rightMenuCard = this.getElementById("right-menu-card");
//         this.todoContainer = this.querySelector(".todo-container");
//         this.rightArrowButtons = this.querySelectorAll(".arrow-btn");
        
//     }

//     getElementById(element) {
//         return document.getElementById(element);
//     }

//     querySelector(element) {
//         return document.querySelector(element);
//     }

//     querySelectorAll(element) {
//         return document.querySelectorAll(element);
//     }

//     getCurrentTaskId() {
//         const activeTaskElement = this.querySelector('.todo-list li.active');
//         if (!activeTaskElement) {
//             return null;
//         }
//         const taskId = activeTaskElement.getAttribute('data-task');
//         console.log('Task id:', taskId);
//         return taskId;
//     }

//     updateTaskCounter() {
//         const taskCounter = this.getElementById('today-task-counter');
//         taskCounter.textContent = this.taskManager.tasks.length;
//         localStorage.setItem('taskCount', this.taskManager.tasks.length);
//         console.log('Task counter:', taskCounter);
//     }

//     checkTaskOverflow() {
//         const todoList = this.querySelector('.todo-list');
//         if (this.taskManager.tasks.length > 5) {
//             todoList.classList.add('overflow');
//         } else {
//             todoList.classList.remove('overflow');
//         }
//     }

//     addTaskEventListener() {
//         this.getElementById('add-task-btn').addEventListener('click', () => {
//             const newTaskInput = this.getElementById('new-task-input');
//             const taskDescription = newTaskInput.value;
//             if (taskDescription) {
//                 this.taskManager.addTask(taskDescription);
//                 newTaskInput.value = '';
//                 this.querySelector('.todo-list').innerHTML = '';
//                 this.taskManager.renderTasks();
//                 this.attachDeleteEventListeners();
//             }
//             this.updateTaskCounter();
//             this.checkTaskOverflow();
//         });
//     }

//     addTaskClickEventListener() {
//         this.querySelectorAll('.todo-list li').forEach(task => {
//             task.addEventListener('click', () => {
//                 let taskName = task.querySelector('label').innerText;
//                 let taskRenameInput = this.querySelector('.task-rename');
//                 taskRenameInput.value = taskName;
//                 const taskId = task.getAttribute('data-task');
//                 this.loadSubtasks(taskId);
//             });
//             const checkbox = task.querySelector('input[type="checkbox"]');
//             const label = task.querySelector('label');
//             checkbox.addEventListener('change', () => {
//                 if (checkbox.checked) {
//                     label.classList.add('task-completed');
//                 } else {
//                     label.classList.remove('task-completed');
//                 }
//             });
//         });
//     }

//     attachDeleteEventListeners() {
//         this.querySelectorAll('.delete-task-button').forEach(button => {
//             button.addEventListener('click', () => {
//                 const taskId = this.getCurrentTaskId();
//                 console.log(taskId);
//                 this.taskManager.deleteTask(taskId);
//                 this.querySelector('.todo-list').innerHTML = '';
//                 this.taskManager.renderTasks();
//                 this.updateTaskCounter();
//             });
//         });
//         this.checkTaskOverflow();
//     }

//     updateDayOfMonth() {
//         const currentDate = new Date();
//         const dayOfMonth = currentDate.getDate();
//         const dayOfMonthElement = this.getElementById("dayOfMonth");
//         dayOfMonthElement.textContent = dayOfMonth;
//     }

//     toggleMenu() {
//         this.hamburger.addEventListener("click", () => {
//             this.leftMenuCard.classList.toggle("expanded");
//             this.todoContainer.classList.toggle("left-expanded");
//             this.hamburger.classList.toggle("left-expanded");
//         });
//     }

//     // Save subtask
//     saveSubtask(taskId, subtask) {
//         let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
//         let task = tasks.find(task => task.id === taskId);
//         if (task) {
//             if (!task.subtasks) {
//                 task.subtasks = [];
//             }
//             task.subtasks.push(subtask);
//             localStorage.setItem('tasks', JSON.stringify(tasks));
//         }
//     }

//     // Load subtasks
//     loadSubtasks(taskId) {
//         let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
//         let task = tasks.find(task => task.id === taskId);
//         if (task && task.subtasks) {
//             const subtaskList = this.getElementById('subtask-list');
//             subtaskList.innerHTML = ''; // Clear the list
//             task.subtasks.forEach((subtask, index) => { // Add index here
//                 const newSubtask = document.createElement('li');

//                 const checkbox = document.createElement('input');
//                 checkbox.type = 'checkbox';
//                 newSubtask.appendChild(checkbox);

//                 const label = document.createElement('label');
//                 label.textContent = subtask;
//                 newSubtask.appendChild(label);

//                 const deleteButton = document.createElement('button');
//                 deleteButton.textContent = 'X';
//                 deleteButton.style.float = 'right';
//                 deleteButton.addEventListener('click', () => {
//                     newSubtask.remove();
//                     task.subtasks.splice(index, 1);
//                     localStorage.setItem('tasks', JSON.stringify(tasks));
//                 });
//                 newSubtask.appendChild(deleteButton);

//                 subtaskList.appendChild(newSubtask);
//             });
//         }
//     }

//     // Add subtask event listener
//     addSubtaskEventListener() {
//         this.getElementById('add-subtask-btn').addEventListener('click', () => {
//             const subtaskInput = this.getElementById('new-subtask-input');
//             const subtaskList = this.getElementById('subtask-list');

//             if (subtaskInput.value) {
//                 const newSubtask = document.createElement('li');

//                 const checkbox = document.createElement('input');
//                 checkbox.type = 'checkbox';
//                 newSubtask.appendChild(checkbox);

//                 const label = document.createElement('label');
//                 label.textContent = subtaskInput.value;
//                 newSubtask.appendChild(label);

//                 const deleteButton = document.createElement('button');
//                 deleteButton.textContent = 'X';
//                 deleteButton.style.float = 'right';
//                 deleteButton.addEventListener('click', () => {
//                     newSubtask.remove();
//                     let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
//                     let task = tasks.find(task => task.id === this.getCurrentTaskId());
//                     if (task) {
//                         const subtaskIndex = task.subtasks.indexOf(label.textContent);
//                         if (subtaskIndex > -1) {
//                             task.subtasks.splice(subtaskIndex, 1);
//                         }
//                         localStorage.setItem('tasks', JSON.stringify(tasks));
//                     }
//                 });
//                 newSubtask.appendChild(deleteButton); // Add this line

//                 subtaskList.appendChild(newSubtask);
//                 const taskId = this.getCurrentTaskId();
//                 if (taskId) {
//                     this.saveSubtask(taskId, label.textContent);
//                 }
//                 subtaskInput.value = '';

//                 if (subtaskList.children.length > 4) {
//                     subtaskList.style.height = '180px'; // Adjust this value as needed
//                     subtaskList.style.overflowY = 'scroll';
//                     // subtaskList.style.direction = 'rtl'; // Add this line

//                      // Wrap the contents of each subtask in a div and set the direction to 'ltr'
//                     Array.from(subtaskList.children).forEach(child => {
//                         const wrapper = document.createElement('div');
//                         wrapper.style.direction = 'ltr';

//                         while (child.firstChild) {
//                             wrapper.appendChild(child.firstChild);
//                         }

//                         child.appendChild(wrapper);
//                     });
//                 }
//             }
//         });
//     }

//     // Load subtasks for current task
//     loadSubtasksForCurrentTask() {
//         const taskId = this.getCurrentTaskId();
//         if (taskId) {
//             this.loadSubtasks(taskId);
//         }
//     }
   

//     toggleNewListForm() {
//         this.querySelector('.add-list').addEventListener('click', () => {
//             const newListForm = this.getElementById('new-list-form');
//             newListForm.style.display = newListForm.style.display === 'block' ? 'none' : 'block';
//         });
//     }

//     addNewList() {
//         this.getElementById('new-list-name').addEventListener('keypress', (event) => {
//             if (event.key === 'Enter') {
//                 const newListName = event.target.value;
//                 const dynamicColor = this.getElementById('dynamic-color-card').style.backgroundColor;
//                 if (newListName) {
//                     // Update the CSS variable with the new color
//                     document.documentElement.style.setProperty('--dynamic-color-card', dynamicColor);

//                     const newListElement = this.createListElement(newListName, dynamicColor);
//                     const addListButton = this.querySelector('.add-list');
//                     addListButton.parentNode.insertBefore(newListElement, addListButton);
//                     event.target.value = '';
//                     this.getElementById('new-list-form').style.display = 'none';

//                     // Store the new list name and color in localStorage
//                     let lists = JSON.parse(localStorage.getItem('lists')) || [];
//                     lists.push({ name: newListName, color: dynamicColor });
//                     localStorage.setItem('lists', JSON.stringify(lists));

//                     // Update the dropdown menu
//                     this.populateDropdownMenus();
//                 }
//             }
//         });
//     }

//     loadLists() {
//         let lists = JSON.parse(localStorage.getItem('lists')) || [];
//         lists.forEach(list => {
//             const newListElement = this.createListElement(list.name, list.color);
//             const addListButton = this.querySelector('.add-list');
//             addListButton.parentNode.insertBefore(newListElement, addListButton);
//         });
//     }
// }

class UserInterface {
    constructor() {
        this.rightArrowButtons = document.querySelectorAll('.right-arrow');
        this.rightMenuCard = document.querySelector('.right-menu-card');
        this.todoContainer = document.querySelector('.todo-container');
        this.taskCount = 0;
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
        });

        return newListElement;
    }

    addList(name, color) {
        let lists = JSON.parse(localStorage.getItem('lists')) || [];
        lists.push({name: name, color: color});
        localStorage.setItem('lists', JSON.stringify(lists));
        this.populateDropdownMenus(); // Update the dropdown menu
    }

    deleteList(name) {
        let lists = JSON.parse(localStorage.getItem('lists')) || [];
        const index = lists.findIndex(list => list.name === name);
        if (index !== -1) {
            lists.splice(index, 1);
            localStorage.setItem('lists', JSON.stringify(lists));
        }
        this.populateDropdownMenus(); // Update the dropdown menu
    }

    populateDropdownMenus() {
        this.populateListsDropdownMenu();
        this.populateTagsDropdownMenu();
    }

    populateListsDropdownMenu() {
        const listSelectElement = document.querySelector('.list select');
        listSelectElement.innerHTML = ''; // Clear the current options
        const lists = JSON.parse(localStorage.getItem('lists')) || [];
        lists.forEach(list => {
            const option = document.createElement('option');
            option.value = list.name;
            option.textContent = list.name;
            listSelectElement.appendChild(option);
        });
    }

    populateTagsDropdownMenu() {
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

    addNewTag() {
        this.querySelector('.add-tag').addEventListener('click', () => {
            const newTag = this.createTagElement(`Tag ${this.querySelectorAll('.tag').length + 1}`, this.getRandomColor());
            const addTagButton = this.querySelector('.add-tag');
            addTagButton.parentNode.insertBefore(newTag, addTagButton);
            this.saveTags();
        });

        this.getElementById('add-tag-dropdown').addEventListener('change', (event) => {
            const newTag = this.createTagElement(event.target.value, this.getRandomColor());
            const addTagButton = this.querySelector('.add-tag');
            addTagButton.parentNode.insertBefore(newTag, addTagButton);
            this.saveTags();
        });
    }

    addTag() {
        this.getElementById('add-tag-btn').addEventListener('click', () => {
            // Assume you get tagText and tagColor from input fields
            let tags = JSON.parse(localStorage.getItem('tags')) || [];
            tags.push({text: tagText, bgColor: tagColor});
            localStorage.setItem('tags', JSON.stringify(tags));

            // Update the dropdown menus
            this.populateDropdownMenus();
        });
    }

    deleteTag() {
        this.getElementById('delete-tag-btn').addEventListener('click', () => {
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

    renameTag() {
        this.getElementById('rename-tag-btn').addEventListener('click', () => {
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

    loadTags() {
        const tags = JSON.parse(localStorage.getItem('tags') || '[]');
        tags.forEach(tag => {
            const newTag = this.createTagElement(tag.text, tag.bgColor);
            const addTagButton = this.querySelector('.add-tag');
            addTagButton.parentNode.insertBefore(newTag, addTagButton);
        });
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

        return newTag;
    }

    saveTags() {
        const tags = Array.from(this.querySelectorAll('.tag')).map(tag => ({
            text: tag.querySelector('.tag-text').textContent,
            bgColor: tag.style.backgroundColor
        }));
        localStorage.setItem('tags', JSON.stringify(tags));
    }

    setColorOptions() {
        const colorOptions = document.querySelectorAll('.color-option-1, .color-option-2, .color-option-3, .color-option-4, .color-option-5, .color-option-6, .color-option-7, .color-option-8');
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
            this.loadTags(); 
            this.addSubtaskEventListener();
            this.loadSubtasksForCurrentTask();
            this.populateDropdownMenus();
        });
    }
}
