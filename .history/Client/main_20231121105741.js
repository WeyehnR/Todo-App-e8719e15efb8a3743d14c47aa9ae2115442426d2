const getElementById = (element) => document.getElementById(element);
const querySelector = (element) => document.querySelector(element);
document.addEventListener("DOMContentLoaded", function () {
    // Your JavaScript code here
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    const dayOfMonthElement = getElementById("dayOfMonth");
    dayOfMonthElement.textContent = dayOfMonth;
});

// Get references to the hamburger icon, menu card, and todo-container
const hamburger = getElementById("ham-menu-toggle");
const menuCard = getElementById("left-menu-card");
const todoContainer = document.querySelector(".todo-container");

// Add a click event listener to toggle the menu card's expanded state
hamburger.addEventListener("click", () => {
  menuCard.classList.toggle("expanded");
  todoContainer.classList.toggle("expanded");
  hamburger.classList.toggle("expanded");
});


  