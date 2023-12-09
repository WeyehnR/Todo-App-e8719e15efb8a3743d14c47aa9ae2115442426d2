export default class TaskDetailsUI {
    constructor(taskManager, ui) {
        this.taskManager = taskManager;
        this.ui = ui;
        this.domHelper = new DOMHelper();

        this.rightMenuCard = this.domHelper.getElementById("right-menu-card");
        this.todoContainer = this.domHelper.querySelector(".todo-container");

        // Cache frequently accessed DOM elements
        this.taskDetails = this.rightMenuCard;
        this.taskRename = this.domHelper.querySelector('.task-rename');
        this.descriptionBox = this.domHelper.querySelector('.description-box');
        this.dueDateSelect = this.domHelper.querySelector('#due-date-select');
        this.timeSelect = this.domHelper.querySelector('#due-time-select');
        this.listSelect = this.domHelper.querySelector('#list-select');
        this.tagsSelect = this.domHelper.querySelector('#tags-select');
        this.subtaskList = this.domHelper.querySelector('#subtask-list');

        // ...

        // Attach event listeners for task details view
        this.initEventListeners();

        // Load subtasks from local storage
        this.loadSubtasksFromLocalStorage();

        // Call a method to render task details (if needed)
    }

    // Initialize event listeners
    initEventListeners() {
        this.bindTaskRename();
        this.bindListSelect();
        this.bindDescriptionBox();
        this.bindDueDateSelect();
        this.bindTimeSelect();
        this.bindTagsSelect();
        this.closeRightMenu();

        // Event delegation for subtask checkboxes
        this.subtaskList.addEventListener('click', (event) => {
            if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {
                // Handle checkbox click here
            }
        });

        // Close button event listener
        const closeButton = this.domHelper.querySelector('.close-icon');
        closeButton.addEventListener('click', () => {
            this.closeRightMenu();
        });

        // Delete button event listener
        const deleteButton = this.domHelper.querySelector('.delete-task-button');
        deleteButton.addEventListener('click', () => {
            const activeTaskId = localStorage.getItem('activeTaskId');
            if (activeTaskId) {
                this.deleteTask(activeTaskId);
            }
        });

        // Save button event listener
        const saveButton = this.domHelper.querySelector('.save-changes-button');
        saveButton.addEventListener('click', () => {
            const activeTaskId = localStorage.getItem('activeTaskId');
            if (activeTaskId) {
                this.saveChanges(activeTaskId);
            }
        });

        // Add Subtask button event listener
        const addSubtaskButton = this.domHelper.querySelector('#add-subtask-btn');
        addSubtaskButton.addEventListener('click', () => {
            const subtaskName = this.domHelper.querySelector('#new-subtask-input').value;
            if (subtaskName) {
                const subtask = new Subtask(Date.now(), subtaskName);
                this.addSubtasksToDOM(subtask);
                this.updateLocalStorageWithSubtask(subtask);
                this.domHelper.querySelector('#new-subtask-input').value = '';
            }
        });
    }
    closeRightMenu() {
        this.rightMenuCard.classList.remove('expanded');
        this.rightMenuCard.style.display = 'none';
        this.todoContainer.classList.remove('right-expanded');
        this.todoContainer.style.width = 'calc(100% - 5%)';
    }
    
    // Attach event listeners to delete task buttons
    attachDeleteEventListeners() {
        const buttons = this.domHelper.querySelectorAll('.delete-task-button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const activeTaskId = localStorage.getItem('activeTaskId');
                if (activeTaskId) {
                    this.deleteTask(activeTaskId);
                }
            });
        });
        this.checkTaskOverflow();
    }
    
    // Attach event listener to save changes button
    attachSaveChangesEventListeners() {
        const button = this.domHelper.querySelector('.save-changes-button');
        button.addEventListener('click', () => {
            const activeTaskId = localStorage.getItem('activeTaskId');
            if (activeTaskId) {
                this.saveChanges(activeTaskId);
            }
            });
        }
    
        // Delete a task by its ID
        deleteTask(activeTaskId) {
            this.taskManager.deleteTask(activeTaskId);
            const activeTaskElement = this.domHelper.querySelector(`[data-task="${activeTaskId}"]`);
            activeTaskElement.remove();
            localStorage.removeItem('activeTaskId');
            if (this.taskManager.getTasks().length === 0) {
                localStorage.removeItem('tasks');
                this.closeRightMenu();
            } else {
                localStorage.setItem('tasks', JSON.stringify(this.taskManager.getTasks()));
                this.closeRightMenu();
            }
        }
    
        // Attach event listeners for task rename input field
        bindTaskRename() {
            this.taskRename.addEventListener('blur', (event) => {
                const newName = event.target.value;
                const taskTitle = this.domHelper.querySelector('.task-title');
                taskTitle.textContent = 'Task: ' + newName;
                this.updateTaskProperty('name', newName);
    
                const activeTaskId = localStorage.getItem('activeTaskId');
                const label = document.querySelector(`label[for="task-${activeTaskId}"]`);
                label.textContent = newName;
            });
        }
    
        // Attach event listeners for description box input field
        bindDescriptionBox() {
            this.descriptionBox.addEventListener('blur', (event) => {
                const description = event.target.value;
                this.updateTaskProperty('description', description);
            });
        }
    
        // Attach event listeners for list select input field
        bindListSelect() {
            this.listSelect.addEventListener('change', (event) => {
                const selectedList = event.target.value;
                this.updateTaskProperty('selectedList', selectedList);
            });
        }
    
        // Attach event listeners for due date select input field
        bindDueDateSelect() {
            this.dueDateSelect.addEventListener('change', (event) => {
                const selectedDueDate = event.target.value;
                this.updateTaskProperty('selectedDueDate', selectedDueDate);
            });
        }
    
        // Attach event listeners for time select input field
        bindTimeSelect() {
            this.timeSelect.addEventListener('change', (event) => {
                const selectedTime = event.target.value;
                this.updateTaskProperty('selectedTime', selectedTime);
            });
        }
    
        // Attach event listeners for tags select input field
        bindTagsSelect() {
            this.tagsSelect.addEventListener('change', (event) => {
                const selectedTags = event.target.value;
                this.updateTaskProperty('selectedTags', selectedTags);
            });
        }
    
        // Update a task property in local storage
        updateTaskProperty(property, value) {
            const activeTaskId = localStorage.getItem('activeTaskId');
            let tasks = JSON.parse(localStorage.getItem('tasks'));
            const activeTask = tasks.find(task => task.id === Number(activeTaskId));
            activeTask[property] = value;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    
        // ... (other methods)
    }
    
