
// Get the current date
const currentDate = new Date();

// Get the day of the month (1-31)
const dayOfMonth = currentDate.getDate();

// Find the span element by its id and set its content to the day of the month
const dayOfMonthElement = document.getElementById("dayOfMonth");
dayOfMonthElement.textContent = dayOfMonth;



