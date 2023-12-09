// TaskDetailsUI.js

// Import necessary modules and classes, including DOMHelper
import DOMHelper from './DOMHelper.js';
import Subtask from './Subtask.js';


export default class TaskDetailsUI {
    constructor(taskManager, ui) {
        // Initialize TaskDetailsUI with references to taskManager, UI, and DOMHelper
        this.taskManager = taskManager;
        this.ui = ui;
        this.domHelper = new DOMHelper();

        this.rightMenuCard = this.domHelper.getElementById("right-menu-card");
        this.todoContainer = this.domHelper.querySelector(".todo-container");

        // Get references to relevant HTML elements
        this.taskRename = this.domHelper.querySelector('.task-rename');
        this.descriptionBox = this.domHelper.querySelector('.description-box');
        this.dueDateSelect = this.domHelper.querySelector('#due-date-select');
        this.timeSelect = this.domHelper.querySelector('#due-time-select');
        this.listSelect = this.domHelper.querySelector('#list-select');
        this.tagsSelect = this.domHelper.querySelector('#tags-select');
        this.subtaskList = this.domHelper.querySelector('#subtask-list');
        this.taskDetails = this.domHelper.getElementById('right-menu-card');
    }

    // Initialize the TaskDetailsUI and set up event listeners
    init() {
        // Add event listeners for task details view
        this.bindTaskRename();
        this.bindListSelect()
        this.bindDescriptionBox();
        this.bindDueDateSelect();
        this.bindTimeSelect();
        this.bindTagsSelect();
        this.closeRightMenu();

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

        // // Add Subtask button event listener
        // const addSubtaskButton = this.domHelper.querySelector('#add-subtask-btn');
        // addSubtaskButton.addEventListener('click', () => {
        //     const subtaskName = this.domHelper.querySelector('#new-subtask-input').value;
        //     if (subtaskName) {
        //         const subtask = new Subtask(Date.now(), subtaskName);
        //         this.addSubtaskToDOM(subtask);
        //         this.updateLocalStorageWithSubtask(subtask);
        //         this.domHelper.querySelector('#new-subtask-input').value = '';
        //     }
        // });

        // Call a method to render task details (if needed)
    }

    // updateLocalStorageWithSubtask(subtask) {
    //     const tasks = JSON.parse(localStorage.getItem('tasks'));
    //     const activeTaskId = localStorage.getItem('activeTaskId');

    //     const updatedTasks = tasks.map((t) => {
    //         if (String(t.id) === String(activeTaskId)) {
    //             t.subtasks.push(subtask);
    //         }
    //         return t;
    //     });

    //     localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    // }

    updateTaskDetails(task) {
        
        this.taskDetails.querySelector('.task-title').textContent = `Task: ${task.name}`;
        this.taskDetails.querySelector('.task-rename').value = task.name;
        this.taskDetails.querySelector('.task-rename').placeholder = task.name;
        this.taskDetails.querySelector('.description-box').value = task.description;

        this.taskDetails.querySelector('.description-box').value = task.description;
        this.taskDetails.querySelector('.description-box').placeholder = task.description || 'Task Description';

        const listSelect = this.taskDetails.querySelector('#list-select');
        const dueDateSelect = this.taskDetails.querySelector('#due-date-select');
        const tagsSelect = this.taskDetails.querySelector('#tags-select');

        listSelect.selectedIndex = 0;
        dueDateSelect.selectedIndex = 0;
        tagsSelect.selectedIndex = 0;

        const subtaskList = document.getElementById('subtask-list');
        subtaskList.innerHTML = '';

        this.taskDetails.style.display = 'block';
    }
    
    

    // Save changes to a task
    saveChanges(activeTaskId) {
        const taskDetails = this.domHelper.querySelector('#right-menu-card');
        const taskName = this.taskDetails.querySelector('.task-rename').value;
        const taskDescription = this.taskDetails.querySelector('.description-box').value;
        const taskList = this.taskDetails.querySelector('#list-select').value;
        const taskDueDate = this.taskDetails.querySelector('#due-date-select').value;
        const taskTime = this.taskDetails.querySelector('#due-time-select').value;
        const taskTags = this.taskDetails.querySelector('#tags-select').value;

        // Retrieve subtask elements and store them in an array
        const subtaskElements = this.taskDetails.querySelectorAll('#subtask-list li');
        const subtasks = Array.from(subtaskElements).map(element => element.textContent);

        // Find the task by its ID
        const task = this.taskManager.findTaskById(activeTaskId);
        if (!task) {
            return;
        }

        // Update task properties with user input
        task.name = taskName;
        task.description = taskDescription;
        task.selectedList = taskList;
        task.selectedDueDate = taskDueDate;
        task.selectedTime = taskTime;
        task.selectedTags = taskTags;
        task.subtasks = subtasks;

        // Update the task in the TaskManager
        this.taskManager.updateTask(task);

        // Update tasks in local storage
        localStorage.setItem('tasks', JSON.stringify(this.taskManager.getTasks()));

        // Update the task label in the task list
        const taskElement = document.querySelector(`[data-task="${task.id}"]`);
        const taskLabel = taskElement.querySelector('label');
        taskLabel.textContent = task.name;
    }

     // Attach event listeners to delete task buttons
     attachDeleteEventListeners() {
        const buttons = this.domHelper.querySelectorAll('.delete-task-button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const activeTaskId = this.getActiveTaskId();
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
            const activeTaskId = this.getActiveTaskId();
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
    closeRightMenu() {
        this.rightMenuCard.classList.remove('expanded');
        this.rightMenuCard.style.display = 'none'; // Add this line
        this.todoContainer.classList.remove('right-expanded');
        this.todoContainer.style.width = 'calc(100% - 5%)'; // Reset the width of the todo-container
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

    // ... (rest of the methods, including deleteTask and saveChanges)

    // You can refactor and transfer other relevant methods from TaskUI as needed
}
