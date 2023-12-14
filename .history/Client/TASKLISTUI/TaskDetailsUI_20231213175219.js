import DOMHelper from "../DOMHelper/DOMHelper.js";
import Subtask from "../Subtask/Subtask.js";
import TaskSender from "./TaskSender.js";
import UI from "../UI/UI.js";


export default class TaskDetailsUI {
    constructor(taskManager, ui) {
        this.taskManager = taskManager;
        this.ui = ui;
        this.domHelper = new DOMHelper();
        this.taskSender = new TaskSender();

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
        this.closeButton = this.domHelper.querySelector('.close-icon');

        // ...

        // Attach event listeners for task details view
        this.initEventListeners();
    
    }
   

    // Initialize event listeners
    initEventListeners() {
        this.bindTaskRename();
        this.bindListSelect();
        this.bindDescriptionBox();
        this.bindDueDateSelect();
        this.bindTimeSelect();
        this.bindTagsSelect();
        

        this.closeButton.addEventListener('click', () => {
            this.closeRightMenu();
        });

        // Event delegation for subtask checkboxes
        this.subtaskList.addEventListener('click', (event) => {
            if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {
                // Handle checkbox click here
            }
        });
        
        // Add Subtask button event listener
        const addSubtaskButton = this.domHelper.querySelector('#add-subtask-btn');

        // Remove any existing event listeners
        let newButton = addSubtaskButton.cloneNode(true);
        addSubtaskButton.parentNode.replaceChild(newButton, addSubtaskButton);

        newButton.addEventListener('click', async () => {
            const subtaskName = this.domHelper.querySelector('#new-subtask-input').value;
            if (subtaskName) {
                const subtask = new Subtask(Date.now(), subtaskName);
                this.addSubtaskToDOM(subtask);
                const taskId = localStorage.getItem('activeTaskId');
                try {
                    await this.updateTaskWithSubtask(taskId, subtask);
                } catch (err) {
                    console.error('Failed to update task with subtask:', err);
                    // Show an error message in the UI...
                }
                this.domHelper.querySelector('#new-subtask-input').value = '';
            }
        });

        // Add event listener for delete button
        const deleteButton = this.domHelper.querySelector('.delete-task-button');
        deleteButton.addEventListener('click', async () => {
            const activeTaskId = localStorage.getItem('activeTaskId');
            if (activeTaskId) {
                try {
                    await this.deleteTask(activeTaskId);
                } catch (err) {
                    console.error('Failed to delete task:', err);
                    // Show an error message in the UI...
                }
            }
        });
    }
    
    // Delete a task by its ID
    async deleteTask(activeTaskId) {
        // Send a DELETE request to the server
        const response = await fetch(`/api/tasks/${activeTaskId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            if (response.status === 404) {
                // If the server returns a 404 status, assume the task has already been deleted
                console.log(`Task ${activeTaskId} has already been deleted`);
            } else {
                // If the server returns any other error status, throw an error
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        // Update the task data
        this.taskManager.deleteTask(activeTaskId);

        // Update the UI
        const activeTaskElement = this.domHelper.querySelector(`[data-task="${activeTaskId}"]`);
        if (activeTaskElement) {
            activeTaskElement.remove();
        }

        // Update the active task
        localStorage.removeItem('activeTaskId');
        if (this.taskManager.getTasks().length === 0) {
            this.closeRightMenu();
        } else {
            // If there are remaining tasks, set the activeTaskId to the ID of the first task
            const remainingTasks = this.taskManager.getTasks();
            const newActiveTaskId = remainingTasks[0].id;
            localStorage.setItem('activeTaskId', newActiveTaskId);
        }
    }

    async updateTaskWithSubtask(taskId, subtask) {
        console.log(`Updating task with ID: ${taskId}`);
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subtasks: subtask }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    addSubtaskToDOM(subtask) {
        const subtaskElement = this.createSubtaskElement(subtask);
        this.subtaskList.appendChild(subtaskElement);
    }

    createSubtaskElement(subtask) {
        const subtaskElement = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        subtaskElement.appendChild(checkbox);
        subtaskElement.appendChild(document.createTextNode(subtask.name));
        return subtaskElement;
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

            // Send the updated task to the server
            const updatedTask = this.taskManager.findTaskById(activeTaskId);
            if (updatedTask) {
                this.taskSender.updateTaskOnServer(updatedTask);
            } else {
                console.error(`Task with id ${activeTaskId} not found`);
            }
        });
    }
    // Attach event listeners for description box input field
    bindDescriptionBox() {
        this.descriptionBox.addEventListener('blur', (event) => {
            const description = event.target.value;
            this.updateTaskProperty('description', description);

            const activeTaskId = localStorage.getItem('activeTaskId');
            // Send the updated task to the server
            const updatedTask = this.taskManager.findTaskById(activeTaskId);
            if (updatedTask) {
                this.taskSender.updateTaskOnServer(updatedTask);
            } else {
                console.error(`Task with id ${activeTaskId} not found`);
            }
        });
    }
    
    // Attach event listeners for list select input field
    bindListSelect() {
        this.listSelect.addEventListener('change', (event) => {
            const selectedList = event.target.value;
            this.updateTaskProperty('selectedList', selectedList);

            const activeTaskId = localStorage.getItem('activeTaskId');
            // Send the updated task to the server
            const updatedTask = this.taskManager.findTaskById(activeTaskId);
            if (updatedTask) {
                this.taskSender.updateTaskOnServer(updatedTask);
            } else {
                console.error(`Task with id ${activeTaskId} not found`);
            }
        });
    }

    // Attach event listeners for due date select input field
    bindDueDateSelect() {
        this.dueDateSelect.addEventListener('change', function(event) {
            const selectedDueDate = event.target.value;
            this.updateTaskProperty('selectedDueDate', selectedDueDate);

            const activeTaskId = localStorage.getItem('activeTaskId');
            // Send the updated task to the server
            const updatedTask = this.taskManager.findTaskById(Number(activeTaskId));
            if (updatedTask) {
                this.taskSender.updateTaskOnServer(updatedTask);

                // Find the active task in the DOM
                const activeTask = document.querySelector(`li[data-task-id="${activeTaskId}"]`);

                // If the active task exists, create a div element for the due date
                if (activeTask) {
                    // Remove the existing due date element, if any
                    const existingDueDateElement = activeTask.querySelector('.due-date');
                    if (existingDueDateElement) {
                        activeTask.removeChild(existingDueDateElement);
                    }

                    // Create a new due date element
                    const dueDateElement = document.createElement('div');
                    dueDateElement.className = 'due-date';
                    dueDateElement.textContent = selectedDueDate;

                    // Append the due date element to the active task
                    activeTask.appendChild(dueDateElement);
                }
            } else {
                console.error(`Task with id ${activeTaskId} not found`);
            }
        }.bind(this));
    }
    
    // Attach event listeners for time select input field
    bindTimeSelect() {
        this.timeSelect.addEventListener('change', (event) => {
            const selectedTime = event.target.value;
            this.updateTaskProperty('selectedTime', selectedTime);

            const activeTaskId = localStorage.getItem('activeTaskId');
            // Send the updated task to the server
            const updatedTask = this.taskManager.findTaskById(activeTaskId);
            if (updatedTask) {
                this.taskSender.updateTaskOnServer(updatedTask);
            } else {
                console.error(`Task with id ${activeTaskId} not found`);
            }
        });
    }

    // Attach event listeners for tags select input field
    bindTagsSelect() {
        this.tagsSelect.addEventListener('change', (event) => {
            const selectedTags = event.target.value;
            this.updateTaskProperty('selectedTags', selectedTags);

            const activeTaskId = localStorage.getItem('activeTaskId');
            // Send the updated task to the server
            const updatedTask = this.taskManager.findTaskById(activeTaskId);
            if (updatedTask) {
                this.taskSender.updateTaskOnServer(updatedTask);
            } else {
                console.error(`Task with id ${activeTaskId} not found`);
            }
        });
    }
    
    // Update a task property in local storage
    updateTaskProperty(property, value) {
        const activeTaskId = Number(localStorage.getItem('activeTaskId')); // Convert the taskId to a number
        const task = this.taskManager.findTaskById(activeTaskId);
        if (task) {
            task[property] = value;
        } else {
            console.error(`Task with id ${activeTaskId} not found`);
        }
    }
    
    async loadTaskDetailsFromServer() {

       
        // Get the active task ID from local storage
        const taskId = localStorage.getItem('activeTaskId');

        if (!taskId) {
            console.log('No active task ID found in local storage');
            return;
        }

        // Fetch the task details from the server
        const task = await this.taskSender.getTaskFromServer(taskId);

        if (task === null) {
            console.log(`No task found with ID ${taskId}`);
            return;
        }

        // Populate the task details UI with the fetched data
        this.taskRename.value = task.name;
        this.descriptionBox.value = task.description;

        // Wait for the dropdown menus to be populated
        this.ui = new UI();
        await this.ui.populateDropdownMenus();

        // Set the value of listSelect and tagsSelect to the values from the task object
        this.listSelect.value = task.list;
        this.tagsSelect.value = task.tags;

        // Check if the selectedDueDate and selectedTime are in the correct format before setting the value
        if (task.selectedDueDate && task.selectedDueDate !== 'Select Due Date') {
            this.dueDateSelect.value = task.selectedDueDate;
        }
        if (task.selectedTime && task.selectedTime !== 'Select Time') {
            this.timeSelect.value = task.selectedTime;
        }

        // Clear the subtask list
        while (this.subtaskList.firstChild) {
            this.subtaskList.firstChild.remove();
        }

        // Add each subtask to the subtask list
        task.subtasks.forEach(subtask => {
            this.addSubtaskToDOM(subtask);
        });
        
    }

}
    
