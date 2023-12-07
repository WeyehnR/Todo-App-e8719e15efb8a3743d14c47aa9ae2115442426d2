const getElements = (element)

document.addEventListener("DOMContentLoaded", function () {
    // Your JavaScript code here
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    const dayOfMonthElement = document.getElementById("dayOfMonth");
    dayOfMonthElement.textContent = dayOfMonth;
  });
  