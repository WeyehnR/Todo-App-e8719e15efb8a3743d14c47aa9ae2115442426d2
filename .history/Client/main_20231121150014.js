const getElementById = (element) => document.getElementById(element);
const querySelector = (element) => document.querySelector(element);
document.addEventListener("DOMContentLoaded", () => {
  const currentDate = new Date();
  const dayOfMonth = currentDate.getDate();
  const dayOfMonthElement = getElementById("dayOfMonth");
  dayOfMonthElement.textContent = dayOfMonth;

  const hamburger = getElementById("ham-menu-toggle");
  const leftmenuCard = getElementById("left-menu-card");
  const rightMenuCard = getElementById("right-menu-card");
  const todoContainer = querySelector(".todo-container");

  hamburger.addEventListener("click", () => {
      leftmenuCard.classList.toggle("expanded");
      todoContainer.classList.toggle("left-expanded");
      this.classList.toggle("left-expanded");
  });

  const rightArrowButtons = document.querySelectorAll(".arrow-btn");
  rightArrowButtons.forEach(button => {
      button.addEventListener("click", () => {
          rightMenuCard.classList.toggle("expanded");
          todoContainer.classList.toggle("right-expanded");
      });
  });
});



  