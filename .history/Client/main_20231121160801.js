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
          rightMenuCard.classList.toggle("expanded");
          todoContainer.classList.toggle("right-expanded");
      });
  });
  
  let selectedTask = null;

    // Add click event listeners to all tasks
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
});



  