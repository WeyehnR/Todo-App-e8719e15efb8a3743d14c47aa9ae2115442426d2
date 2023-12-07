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
    

    // Get a reference to the right arrow buttons and the right menu card
    const rightArrowButtons = document.querySelectorAll(".arrow-btn");
    const rightMenuCard = document.getElementById("right-menu-card");

    // Add a click event listener to each right arrow button to toggle the right menu card's expanded state
    rightArrowButtons.forEach((button) => {
      button.addEventListener("click", () => {
        rightMenuCard.classList.toggle("expanded");
      });
    });
});


  