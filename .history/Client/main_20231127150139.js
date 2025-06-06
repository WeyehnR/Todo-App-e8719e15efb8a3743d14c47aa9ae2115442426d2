import Task from './Task.js';
import TaskManager from './TaskManager.js';


const getElementById = (element) => document.getElementById(element);
const querySelector = (element) => document.querySelector(element);
document.addEventListener("DOMContentLoaded", () => {
  const currentDate = new Date();
  const dayOfMonth = currentDate.getDate();
  const dayOfMonthElement = getElementById("dayOfMonth");
  dayOfMonthElement.textContent = dayOfMonth;

  const hamburger = querySelector(".hamburger");
  const leftMenuCard = querySelector(".left-menu-card");
  const rightMenuCard = getElementById("right-menu-card");
  const todoContainer = querySelector(".todo-container");
  

    //console.log the localStorage
    console.log(localStorage);
    // Create a new TaskManager
    const taskManager = new TaskManager();

    // Load the tasks from local storage
    taskManager.loadTasks();

    // Render the tasks
    taskManager.renderTasks();

    // Add event listener to the delete buttons
    document.querySelectorAll('.delete-task-button').forEach(deleteButton => {
        deleteButton.addEventListener('click', (event) => {
            // Prevent the task click event from being triggered
            event.stopPropagation();

            // Get the task id from the delete button's data-task-id attribute
            const taskId = deleteButton.getAttribute('data-task-id');

            // Delete the task
            taskManager.deleteTask(taskId);

            // Remove the task element from the DOM
            deleteButton.parentElement.remove();
        });
    });


    // Add a task when the "Add Task" button is clicked
    getElementById('add-task-btn').addEventListener('click', function() {
        const newTaskInput = getElementById('new-task-input');
        const taskDescription = newTaskInput.value;

        if (taskDescription) {
            // Add a new task with the input value
            taskManager.addTask(taskDescription);

            // Clear the input field
            newTaskInput.value = '';
        }
    });

  hamburger.addEventListener("click", () => {
      leftMenuCard.classList.toggle("expanded");
      todoContainer.classList.toggle("left-expanded");
      hamburger.classList.toggle("left-expanded");
  });

    const rightArrowButtons = document.querySelectorAll(".arrow-btn");
    rightArrowButtons.forEach(button => {
        button.addEventListener("click", () => {
            rightMenuCard.classList.add("expanded");
            todoContainer.classList.add("right-expanded");
        });
    });
  let selectedTask = null;
  // Add click event listeners to all task
  document.querySelectorAll('.todo-list li').forEach(task => {
    task.addEventListener('click', () => {
        selectedTask = task;
    });
  });

  document.getElementById('reset-btn').addEventListener('click', function() {
    localStorage.clear();
    location.reload();  // Reload the page to reflect the changes
    });

 
    document.querySelector('.close-icon').addEventListener('click', () => {
        rightMenuCard.classList.remove('expanded');
        todoContainer.classList.remove('right-expanded');
    });
   

    // Add event listener to the delete buttons
    document.querySelectorAll('.delete-task-button').forEach(deleteButton => {
        deleteButton.addEventListener('click', (event) => {
            // Prevent the task click event from being triggered
            event.stopPropagation();

            // Get the task id from the delete button's data-task-id attribute
            const taskId = deleteButton.getAttribute('data-task-id');

            // Delete the task
            taskManager.deleteTask(taskId);

            // Remove the task element from the DOM
            deleteButton.parentElement.remove();
        });
    });

    // Get all tasks
    let tasks = document.querySelectorAll('.todo-list li');

    // Add click event listener to each task
    tasks.forEach(task => {
        task.addEventListener('click', function() {
            // Get task name from the label within the clicked li
            let taskName = this.querySelector('label').innerText;

            // Find task rename input field
            let taskRenameInput = document.querySelector('.task-rename');

            // Set value of task rename input field to task name
            taskRenameInput.value = taskName;
        });
    });
});



  