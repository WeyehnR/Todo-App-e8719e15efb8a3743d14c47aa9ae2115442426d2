const getElementById = (element) => document.getElementById(element);

document.addEventListener("DOMContentLoaded", function () {
    // Your JavaScript code here
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    const dayOfMonthElement = getElementById("dayOfMonth");
    dayOfMonthElement.textContent = dayOfMonth;
});

const hamburger = getElementById("ham-menu-toggle");
const menuCard = getElementById("menu-card");

hamburger.addEventListener("click", () => {
    menuCard.classList.toggle("hidden");

  