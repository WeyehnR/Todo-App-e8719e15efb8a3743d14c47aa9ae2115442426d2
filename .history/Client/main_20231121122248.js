const getElementById = (element) => document.getElementById(element);
const querySelector = (element) => document.querySelector(element);
document.addEventListener("DOMContentLoaded", function () {
    // Your JavaScript code here
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    const dayOfMonthElement = getElementById("dayOfMonth");
    dayOfMonthElement.textContent = dayOfMonth;

    // Get references to the hamburger icon, menu card, and todo-container
    const hamburger = getElementById("ham-menu-toggle");
    const menuCard = getElementById("left-menu-card");
    const todoContainer = querySelector(".todo-container");

    // Add a click event listener to toggle the menu card's expanded state
    hamburger.addEventListener("click", () => {
      menuCard.classList.toggle("expanded");
      todoContainer.classList.toggle("expanded");
      hamburger.classList.toggle("expanded");
    });
    

    // Get a reference to the right arrow buttons, the right menu card, the todo list, the add new task field, and the todo container
    const rightArrowButtons = document.querySelectorAll(".arrow-btn");
    const rightMenuCard = document.getElementById("right-menu-card");
    const todoList = document.querySelector(".todo-list");
    const addNewTaskField = document.querySelector(".add-task-container");
    const todoContainer = document.querySelector(".todo-container");

    // Add a click event listener to each right arrow button to toggle the right menu card's expanded state
    rightArrowButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const isExpanded = rightMenuCard.classList.toggle("expanded");
        if (isExpanded) {
          todoList.classList.add("expanded");
          addNewTaskField.classList.add("expanded");
          todoContainer.classList.add("expanded");
        } else {
          todoList.classList.remove("expanded");
          addNewTaskField.classList.remove("expanded");
          todoContainer.classList.remove("expanded");
        }
      });
    });
});


  