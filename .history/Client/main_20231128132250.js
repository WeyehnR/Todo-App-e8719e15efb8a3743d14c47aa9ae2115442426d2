import Task from './Task.js';
import TaskManager from './TaskManager.js';

const getElementById = (element) => document.getElementById(element);
const querySelector = (element) => document.querySelector(element);


const getCurrentTaskId = () => {
    // Find the active task element
    const activeTaskElement = document.querySelector('.todo-list li.active');

    // If there's no active task, return null
    if (!activeTaskElement) {
        return null;
    }

    // Get the id from the data-task attribute (instead of data-id)
    const taskId = activeTaskElement.getAttribute('data-task');
    
    console.log('Task id:', taskId);  // Log the task id

    // Return the task id
    return taskId;
};

const updateTaskCounter = (taskManager) => {
    const taskCounter = document.getElementById('today-task-counter');
    taskCounter.textContent = taskManager.tasks.length;

    // Store the count in localStorage
    localStorage.setItem('taskCount', taskManager.tasks.length);

    console.log('Task counter:', taskCounter);
};

const addTaskEventListener = (taskManager) => {
    getElementById('add-task-btn').addEventListener('click', function() {
        const newTaskInput = getElementById('new-task-input');
        const taskDescription = newTaskInput.value;

        if (taskDescription) {
            taskManager.addTask(taskDescription);
            newTaskInput.value = '';
            // Clear the current tasks from the UI before rendering
            document.querySelector('.todo-list').innerHTML = '';
            taskManager.renderTasks();
            attachDeleteEventListeners(taskManager);
        }
        updateTaskCounter(taskManager);
    });
};

const addTaskClickEventListener = () => {
    document.querySelectorAll('.todo-list li').forEach(task => {
        task.addEventListener('click', function() {
            let taskName = this.querySelector('label').innerText;
            let taskRenameInput = document.querySelector('.task-rename');
            taskRenameInput.value = taskName;
        });
    });
};

const attachDeleteEventListeners = (taskManager) => {
    document.querySelectorAll('.delete-task-button').forEach(button => {
        button.addEventListener('click', () => {
            // Get the id of the current task
            const taskId = getCurrentTaskId();

            console.log(taskId);

            // Delete the task
            taskManager.deleteTask(taskId);

            // Clear the current tasks from the UI before rendering
            document.querySelector('.todo-list').innerHTML = '';
            taskManager.renderTasks();
            updateTaskCounter(taskManager);
        });
    });
};

const updateListColor = (color) => {
    document.getElementById('dynamic-color-card').style.backgroundColor = color;
};

document.addEventListener("DOMContentLoaded", () => {
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    const dayOfMonthElement = getElementById("dayOfMonth");
    dayOfMonthElement.textContent = dayOfMonth;

    const hamburger = querySelector(".hamburger");
    const leftMenuCard = querySelector(".left-menu-card");
    const rightMenuCard = getElementById("right-menu-card");
    const todoContainer = querySelector(".todo-container");

    const taskManager = new TaskManager();
    taskManager.renderTasks();
    
    // Get the count from localStorage and update the counter
    const taskCount = localStorage.getItem('taskCount') || 0;
    document.getElementById('today-task-counter').textContent = taskCount;
    

    addTaskEventListener(taskManager);
    //attach delete event listeners
    attachDeleteEventListeners(taskManager);
    addTaskClickEventListener();
   

    hamburger.addEventListener("click", () => {
        leftMenuCard.classList.toggle("expanded");
        todoContainer.classList.toggle("left-expanded");
        hamburger.classList.toggle("left-expanded");
    });

    document.querySelector('.menu-item.add-list').addEventListener('click', () => {
        document.getElementById('new-list-form').style.display = 'block';
    });

    document.querySelectorAll('.color-button').forEach(button => {
        button.addEventListener('click', (event) => {
            document.getElementById('dynamic-color-card').style.backgroundColor = event.target.style.backgroundColor;
        });
    });

    // Get all color options
    const colorOptions = document.querySelectorAll('.color-option-1, .color-option-2, .color-option-3, .color-option-4, .color-option-5, .color-option-6, .color-option-7, .color-option-8');
    console.log(colorOptions); // Check if the correct elements are being selected

    // Add a click event listener to each color option
    colorOptions.forEach(option => {
        console.log(option); // Check if the event listener is being added to each option
        option.addEventListener('click', function() {
            console.log('Clicked!'); // Check if the event listener is triggering on click

            // Get the background color of the clicked color option
            const color = window.getComputedStyle(this).backgroundColor;
            console.log(color); // Check if the correct color is being fetched

            // Update the background color of the #dynamic-color-card
            document.getElementById('dynamic-color-card').style.backgroundColor = color;
            console.log(document.getElementById('dynamic-color-card').style.backgroundColor); // Check if the dynamic color card is being updated correctly
        });
    });

    // Select the arrow buttons
    const rightArrowButtons = document.querySelectorAll(".arrow-btn");

    // Add a click event listener to each arrow button
    rightArrowButtons.forEach(button => {
        button.addEventListener("click", () => {
            rightMenuCard.classList.add("expanded");
            todoContainer.classList.add("right-expanded");

            // Remove the active class from all task elements
            document.querySelectorAll('.todo-list li').forEach(task => {
                task.classList.remove('active');
            });

            // Add the active class to the parent task element of the clicked button
            button.parentElement.classList.add('active');
        });
    });

    document.getElementById('reset-btn').addEventListener('click', function() {
        localStorage.clear();
        location.reload();
    });

    document.querySelector('.close-icon').addEventListener('click', () => {
        rightMenuCard.classList.remove('expanded');
        todoContainer.classList.remove('right-expanded');
    });
    
});