import Task from ''


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

    // Add click event listener to the "Delete Task" button
    document.querySelector('.delete-task-button').addEventListener('click', () => {
        if (selectedTask) {
            selectedTask.remove();
            selectedTask = null;
        }
    });

    document.querySelector('.close-icon').addEventListener('click', () => {
        rightMenuCard.classList.remove('expanded');
        todoContainer.classList.remove('right-expanded');
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



  