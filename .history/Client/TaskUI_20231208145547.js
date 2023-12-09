import TaskManager from './TaskManager.js';
import Task from './Task.js';
import DOMHelper from './DOMHelper.js';
import SubTaskManager from './SubTaskManager.js';
import Subtask from './Subtask.js';

export default class TaskUI {
    constructor(taskManager, domHelper, ui) {
        this.taskManager = taskManager;
        this.domHelper = domHelper;
        this.addTaskButtonClicked = false;
        this.isInitialized = false;
        this.addTaskHandler = null; // add this line
        this.ui = ui;
        this.rightMenuCard = this.domHelper.getElementById("right-menu-card");
        this.todoContainer = this.domHelper.querySelector(".todo-container");
        this.todoList = document.querySelector('.todo-list');

        // Bind 'this' to the addTaskEventListener method
        this.addTaskEventListener = this.addTaskEventListener.bind(this);
    }

    checkTaskOverflow() {
        const todoList = this.domHelper.querySelector('.todo-list');
        if (this.taskManager.tasks.length > 5) {
            todoList.classList.add('overflow');
        } else {
            todoList.classList.remove('overflow');
        }
    }
    

    addTaskEventListener() {
        const addTaskBtn = this.domHelper.getElementById('add-task-btn');
        // Get the task counter element
        const taskCounter = this.domHelper.getElementById('today-task-counter');

        if (addTaskBtn) {
            // Remove the existing event listener, if any
            if (this.addTaskHandler) {
                addTaskBtn.removeEventListener('click', this.addTaskHandler);
            }

            // Define the new event listener
            this.addTaskHandler = () => {
                const taskName = this.domHelper.getElementById('new-task-input').value;
                if (taskName) {
                    // Create a new Task with the specified properties
                    const task = {
                        id: Date.now(), // Use the current timestamp as the id
                        name: taskName, // Use the value of the input field as the name
                        description: '',
                        selectedList: 'Select List',
                        selectedDueDate: 'Select Due Date',
                        selectedTags: 'Select Tag',
                        isCompleted: false,
                        subtasks: []
                    };

                    this.taskManager.createTask(task); // Add the Task to the TaskManager
                    
                    // Add the task to the UI
                    this.addTask(task);
                    
                    // Increment the task counter
                    taskCounter.textContent = Number(taskCounter.textContent) + 1;
                }
            };

            // Add the new event listener
            addTaskBtn.addEventListener('click', this.addTaskHandler);
        }
    }

    

    addTaskClickEventListener() {
        const tasks = this.domHelper.querySelectorAll('.todo-list li');
        tasks.forEach(task => {
            task.addEventListener('click', () => {
                const taskId = task.getAttribute('data-task');
                this.taskManager.getTaskById(taskId); // get the Task from the TaskManager
            });
        });
    }


    addTask(task) {
        // Create the task element
        const taskElement = this.createTaskElement(task);

        // Add the event listener to the arrow button
        const arrowButton = taskElement.querySelector('.arrow-btn');
        

        // Get the ul element with the class 'todo-list'
        const todoList = document.querySelector('.todo-list');

        // Add the task element to the DOM
        todoList.appendChild(taskElement);
    }

    createTaskElement(task) {
        const taskElement = this.createTaskListItem(task);
        const arrowButton = this.createArrowButton(taskElement, task);
        this.addArrowButtonEventListener(arrowButton, task, taskElement);
        return taskElement;
    }
    
    createTaskListItem(task) {
        const taskElement = document.createElement('li');
        taskElement.setAttribute('data-task', task.id);
        const checkbox = this.createCheckbox(task);
        const label = this.createLabel(task);
        taskElement.appendChild(checkbox);
        taskElement.appendChild(label);
        return taskElement;
    }
    
    createCheckbox(task) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `task-${task.id}`;
        return checkbox;
    }
    
    createLabel(task) {
        const label = document.createElement('label');
        label.setAttribute('for', `task-${task.id}`);
        label.textContent = task.name;
        return label;
    }
    
    createArrowButton(taskElement, task) {
        const arrowButton = document.createElement('button');
        arrowButton.className = 'arrow-btn';
        taskElement.appendChild(arrowButton);
        this.addArrowButtonEventListener(arrowButton, task, taskElement);
        return arrowButton;
    }
    
    addArrowButtonEventListener(arrowButton, task, taskElement) {
        if (arrowButton && !arrowButton.hasAttribute('listener')) {
            const eventListener = (event) => this.ui.expandRightMenu(event);
            console.log('Adding event listener to:', arrowButton);
            arrowButton.addEventListener('click', eventListener);
            arrowButton.setAttribute('listener', 'true');
        }
        arrowButton.addEventListener('click', () => {
            const taskElements = document.querySelectorAll('[data-task]');
        
            // Remove the 'active' class from all task elements
            taskElements.forEach((taskElement) => {
            taskElement.classList.remove('active');
            });
        
            // Add the 'active' class to the current task element
            taskElement.classList.add('active');
        
            // Get the active task element
            const activeTaskElement = document.querySelector('.active');
        
            // Get the ID of the active task from the element's data attributes
            const activeTaskId = activeTaskElement.dataset.task;
        
            // Save the active task ID in local storage
            localStorage.setItem('activeTaskId', activeTaskId);
        
            // Get the task details element
            const taskDetails = document.getElementById('right-menu-card');
        
            // Update the task details element with the details of the task
            taskDetails.querySelector('.task-title').textContent = `Task: ${task.name}`;
            taskDetails.querySelector('.task-rename').value = task.name;
            taskDetails.querySelector('.task-rename').placeholder = task.name;
            taskDetails.querySelector('.description-box').value = task.description;
        
            // Get the select elements
            const listSelect = taskDetails.querySelector('#list-select');
            const dueDateSelect = taskDetails.querySelector('#due-date-select');
            const tagsSelect = taskDetails.querySelector('#tags-select');
        
            // Set the selected index to the first option
            listSelect.selectedIndex = 0;
            dueDateSelect.selectedIndex = 0;
            tagsSelect.selectedIndex = 0;

            localStorage.setItem('activeTaskId', activeTaskId);

            // Clear the subtask list
            const subtaskList = document.getElementById('subtask-list');
            subtaskList.innerHTML = '';

            // Load the subtasks from local storage
            this.loadSubtasksFromLocalStorage();

        
            // Show the task details element
            taskDetails.style.display = 'block';
        });
        }
    
      addSubtaskEventListener() {
        // Get the input field and the "Add Subtask" button
        const inputField = document.getElementById('new-subtask-input');
        const addSubtaskButton = document.getElementById('add-subtask-btn');
        const subtaskList = document.getElementById('subtask-list');

        // Add an event listener to the "Add Subtask" button
        addSubtaskButton.addEventListener('click', () => 
        {
            // Get the value of the input field
            const subtaskName = inputField.value;

            // Check if the input field is not empty
            if (subtaskName) 
            {
                // Create a new Subtask object with a timestamp as its ID and the input field value as its name
                const subtask = new Subtask(Date.now(), subtaskName);

                // Create a new list item for the subtask
                const subtaskElement = document.createElement('li');

                // Create a checkbox
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';

                // Add the checkbox and the subtask name to the list item
                subtaskElement.appendChild(checkbox);
                subtaskElement.appendChild(document.createTextNode(subtask.name));

                // Add the new list item to the subtask list
                subtaskList.appendChild(subtaskElement);

                // Update local storage with the new subtask (assuming you have tasks stored in local storage)
                const tasks = JSON.parse(localStorage.getItem('tasks'));

                const activeTaskId = localStorage.getItem('activeTaskId');

                const updatedTasks = tasks.map((t) => {
                    if (String(t.id) === String(activeTaskId)) {
                        t.subtasks.push(subtask);
                    }
                    return t;
                });

                localStorage.setItem('tasks', JSON.stringify(updatedTasks));

                // Clear the input field
                inputField.value = '';
                }
            });
        }

        loadTasksFromLocalStorage() {
            // Retrieve the tasks array from local storage
            const tasksJson = localStorage.getItem('tasks');
    
            // Check if the tasks array is not null
            if (tasksJson) {
                // Convert the JSON string back into a tasks array
                const tasks = JSON.parse(tasksJson);
    
                // For each task in the tasks array
                for (let task of tasks) {
                    // Add the task to the TaskManager
                    this.taskManager.createTask(task);
    
                    // Add the task to the UI
                    this.addTask(task);
                }
            }
        }
        
        loadSubtasksFromLocalStorage() {
            // Get the active task ID from local storage
            const activeTaskId = localStorage.getItem('activeTaskId');
    
            // Get the tasks from local storage
            const tasks = JSON.parse(localStorage.getItem('tasks'));
            if (!tasks) {
                return;
            }
    
            // Find the active task
            const activeTask = tasks.find((t) => String(t.id) === String(activeTaskId));
    
            // Check if the active task was found
            if (activeTask) {
                // Get the subtask list element
                const subtaskList = document.getElementById('subtask-list');
    
                // Clear the subtask list
                subtaskList.innerHTML = '';
    
                // Add each subtask to the subtask list
                activeTask.subtasks.forEach((subtask) => {
                    // Create a new list item for the subtask
                    const subtaskElement = document.createElement('li');
    
                    // Create a checkbox
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
    
                    // Add the checkbox and the subtask name to the list item
                    subtaskElement.appendChild(checkbox);
                    subtaskElement.appendChild(document.createTextNode(subtask._name));
    
                    // Add the new list item to the subtask list
                    subtaskList.appendChild(subtaskElement);
                });
            }
        }

        

        // Add this method to your UI class
        bindArrowButtons() {
            // Get all the arrow button elements
            const arrowButtons = document.getElementsByClassName('arrow-btn');

            // Convert the HTMLCollection to an array and loop over the arrow buttons
            Array.from(arrowButtons).forEach((arrowButton) => {
                // Add a click event listener to the current arrow button
                arrowButton.addEventListener('click', () => {
                    // Get the active task ID from the data-task attribute of the parent li element
                    const activeTaskId = arrowButton.parentNode.getAttribute('data-task');

                    // Get the tasks from local storage
                    let tasks = JSON.parse(localStorage.getItem('tasks'));

                    // Find the active task
                    const activeTask = tasks.find(task => task.id === Number(activeTaskId));

                    // Get the description box element
                    const descriptionBox = document.getElementsByClassName('description-box')[0];

                    // Set the value of the description box to the description of the active task
                    descriptionBox.value = activeTask.description;

                    // Do the same for other fields
                    const dueDateSelect = document.getElementById('due-date-select');
                    dueDateSelect.value = activeTask.selectedDueDate;

                    const timeSelect = document.getElementById('due-time-select');
                    timeSelect.value = activeTask.selectedTime;

                    // Add code here to set the values of other fields
                    const listSelect = document.getElementById('list-select');
                    listSelect.value = activeTask.selectedList;

                    const tagsSelect = document.getElementById('tags-select');
                    tagsSelect.value = activeTask.selectedTags;
                });
            });
        }

        // Add this method to your UI class
        setDefaultListSelect() {
            // Get the list select element
            const listSelect = document.getElementById('list-select');

            // Check if "Select List" is the only option
            if (listSelect.options.length === 1 && listSelect.options[0].value === "") {
                // Set the selected option to "Select List"
                listSelect.selectedIndex = 0;
            }
        }

        // Add this method to your UI class
        bindTaskRename() {
            // Get the task rename input field
            const taskRename = document.getElementsByClassName('task-rename')[0];

            // Add a blur event listener to the task rename input field
            taskRename.addEventListener('blur', (event) => {
                // Get the new name
                const newName = event.target.value;

                // Update the task title
                const taskTitle = document.getElementsByClassName('task-title')[0];
                taskTitle.textContent = 'Task: ' + newName;

                // Get the active task ID from local storage
                const activeTaskId = localStorage.getItem('activeTaskId');

                // Get the tasks from local storage
                let tasks = JSON.parse(localStorage.getItem('tasks'));

                // Find the active task
                const activeTask = tasks.find(task => task.id === Number(activeTaskId));

                // Update the name key of the active task
                activeTask.name = newName;

                // Save the tasks back to local storage
                localStorage.setItem('tasks', JSON.stringify(tasks));

                // Update the label
                const label = document.querySelector(`label[for="task-${activeTaskId}"]`);
                label.textContent = newName;
            });
        }

        // Add this method to your UI class
        bindDescriptionBox() {
            // Get the description box element
            const descriptionBox = document.getElementsByClassName('description-box')[0];

            // Add a blur event listener to the description box
            descriptionBox.addEventListener('blur', (event) => {
                // Get the description
                const description = event.target.value;

                // Get the active task ID from local storage
                const activeTaskId = localStorage.getItem('activeTaskId');

                // Get the tasks from local storage
                let tasks = JSON.parse(localStorage.getItem('tasks'));

                // Find the active task
                const activeTask = tasks.find(task => task.id === Number(activeTaskId));

                // Update the description property of the active task
                activeTask.description = description;

                // Save the tasks back to local storage
                localStorage.setItem('tasks', JSON.stringify(tasks));
            });
        }

        // Add this method to your TaskUI class
        bindListSelect() {
            // Get the select element
            const listSelect = this.domHelper.getElementById('list-select');

            // Add a change event listener to the select element
            listSelect.addEventListener('change', (event) => {
                // Get the selected option
                const selectedList = event.target.value;

                // Get the active task ID from local storage
                const activeTaskId = localStorage.getItem('activeTaskId');

                // Get the tasks from local storage
                let tasks = JSON.parse(localStorage.getItem('tasks'));

                // Find the active task
                const activeTask = tasks.find(task => task.id === Number(activeTaskId));

                // Update the selectedList property of the active task
                activeTask.selectedList = selectedList;

                // Save the tasks back to local storage
                localStorage.setItem('tasks', JSON.stringify(tasks));
            });
        }
        // Add this method to your TaskUI class
        bindDueDateSelect() {
            // Get the due date select element
            const dueDateSelect = this.domHelper.getElementById('due-date-select');

            // Add a change event listener to the due date select element
            dueDateSelect.addEventListener('change', (event) => {
                // Get the selected due date
                const selectedDueDate = event.target.value;

                // Get the active task ID from local storage
                const activeTaskId = localStorage.getItem('activeTaskId');

                // Get the tasks from local storage
                let tasks = JSON.parse(localStorage.getItem('tasks'));

                // Find the active task
                const activeTask = tasks.find(task => task.id === Number(activeTaskId));

                // Update the selectedDueDate property of the active task
                activeTask.selectedDueDate = selectedDueDate;

                // Save the tasks back to local storage
                localStorage.setItem('tasks', JSON.stringify(tasks));
            });
        }

        // Add this method to your UI class
        bindTimeSelect() {
            // Get the time select element
            const timeSelect = this.domHelper.getElementById('due-time-select');

            // Add a change event listener to the time select element
            timeSelect.addEventListener('change', (event) => {
                // Get the selected time
                const selectedTime = event.target.value;

                // Get the active task ID from local storage
                const activeTaskId = localStorage.getItem('activeTaskId');

                // Get the tasks from local storage
                let tasks = JSON.parse(localStorage.getItem('tasks'));

                // Find the active task
                const activeTask = tasks.find(task => task.id === Number(activeTaskId));

                // If the selectedTime field does not exist, add it
                if (!activeTask.hasOwnProperty('selectedTime')) {
                    activeTask.selectedTime = '';
                }

                // Update the selectedTime property of the active task
                activeTask.selectedTime = selectedTime;

                // Save the tasks back to local storage
                localStorage.setItem('tasks', JSON.stringify(tasks));
            });
        }

        // Add this method to your UI class
        bindTagsSelect() {
            // Get the tags select element
            const tagsSelect = this.domHelper.getElementById('tags-select');

            // Add a change event listener to the tags select element
            tagsSelect.addEventListener('change', (event) => {
                // Get the selected tag
                const selectedTags = event.target.value;

                // Get the active task ID from local storage
                const activeTaskId = localStorage.getItem('activeTaskId');

                // Get the tasks from local storage
                let tasks = JSON.parse(localStorage.getItem('tasks'));

                // Find the active task
                const activeTask = tasks.find(task => task.id === Number(activeTaskId));

                // Update the selectedTags property of the active task
                activeTask.selectedTags = selectedTags;

                // Save the tasks back to local storage
                localStorage.setItem('tasks', JSON.stringify(tasks));
            });
        }
      

    attachDeleteEventListeners() {
        const buttons = this.domHelper.querySelectorAll('.delete-task-button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Get the active task ID from local storage
                const activeTaskId = localStorage.getItem('activeTaskId');

                if (activeTaskId) {
                    // Delete the active task
                    this.taskManager.deleteTask(activeTaskId);

                    // Remove the list element from the DOM
                    const activeTaskElement = document.querySelector(`[data-task="${activeTaskId}"]`);
                    activeTaskElement.remove();

                    // Remove the active task ID from local storage
                    localStorage.removeItem('activeTaskId');

                    // If there are no tasks left, remove tasks from local storage
                    if (this.taskManager.tasks.length === 0) {
                        localStorage.removeItem('tasks');
                        this.ui.closeRightMenu();
                    } else {
                        // Otherwise, update tasks in local storage
                        localStorage.setItem('tasks', JSON.stringify(this.taskManager.tasks));
                        this.ui.closeRightMenu();
                    }
                }
            });
        });
        this.checkTaskOverflow();
    }

    attachSaveChangesEventListeners() {
        const button = document.querySelector('.save-changes-button');
        button.addEventListener('click', () => {
            // Get the active task ID from local storage
            const activeTaskId = localStorage.getItem('activeTaskId');
            // If activeTaskId is not set, return early
            if (!activeTaskId) {
                return;
            }

            // Get the task details element
            const taskDetails = document.getElementById('right-menu-card');

            // Get the values of the input fields
            const taskName = taskDetails.querySelector('.task-rename').value;
            const taskDescription = taskDetails.querySelector('.description-box').value;
            const taskList = taskDetails.querySelector('#list-select').value;
            const taskDueDate = taskDetails.querySelector('#due-date-select').value;
            const taskTime = taskDetails.querySelector('#due-time-select').value;
            const taskTags = taskDetails.querySelector('#tags-select').value;

            // Get the subtasks
            const subtaskElements = taskDetails.querySelector('#subtask-list').children;
            const subtasks = Array.from(subtaskElements).map(element => element.textContent);

            // Get the task from the tasks array
            const task = this.taskManager.findTaskById(activeTaskId);
            if (!task) {
                return;
            }

            // Update the task with the new values
            task.name = taskName;
            task.description = taskDescription;
            task.list = taskList;
            task.dueDate = taskDueDate;
            task.time = taskTime;
            task.tags = taskTags;
            task.subtasks = subtasks;

            // Update the tasks in local storage
            localStorage.setItem('tasks', JSON.stringify(this.taskManager.tasks));

            // Update the UI
            const taskElement = document.querySelector(`[data-task="${task.id}"]`);
            const taskLabel = taskElement.querySelector('label');
            taskLabel.textContent = task.name;
        });
    }
  

    bindEventListeners() {
        // Add an event listener to each task
        const tasks = this.domHelper.querySelectorAll('.todo-list li');
        tasks.forEach(task => {
            task.addEventListener('click', () => {
                // Store the task ID when the task is clicked
                const activeTaskId = localStorage.getItem('activeTaskId');
                this.activeTaskId = activeTaskId;
            });
        });

        // Add an event listener to the list dropdown menu
        const listDropdownMenu = this.domHelper.querySelector('#list-select');
        listDropdownMenu.addEventListener('change', (event) => {
                const selectedList = event.target.value;
                // Use the stored task ID
                const activeTaskId = localStorage.getItem('activeTaskId');
                this.taskManager.updateTaskList(activeTaskId, selectedList);
        });

    }
    init() {
        if (this.isInitialized) {
            return;
        }
        this.domHelper.getElementById('today-task-counter').textContent = this.taskManager.taskCount;
        this.loadTasksFromLocalStorage();
        this.addTaskEventListener();
        this.attachDeleteEventListeners();
        this.addTaskClickEventListener();
        this.addSubtaskEventListener();
        this.loadSubtasksFromLocalStorage();
        this.bindListSelect();
        this.bindDueDateSelect();
        this.bindTagsSelect();
        this.bindTimeSelect();
        this.bindDescriptionBox();
        this.bindArrowButtons();
        this.bindTaskRename();
        this.bindEventListeners();
        this.setDefaultListSelect();
        this.attachSaveChangesEventListeners()
        this.isInitialized = true;
    }

}