
const getElement = (element) => document.getElementById(element);
const menuToggle = getElement('menuToggle');
const addTaskButton = getElement('addTaskButton');
const newTaskInput = getElement('newTaskInput');

document.addEventListener('DOMContentLoaded', () => {
    const currentDate = new Date();
    const today = currentDate.getDate();

    document.getElementById('currentDay').in = today;
});

menuToggle.addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
});

addTaskButton.addEventListener('click', () => {
    const taskValue = newTaskInput.value.trim();

    if (taskValue) {
        // Logic to add the new task
        console.log('Task to add:', taskValue);

        // Clear the input field after adding the task
        newTaskInput.value = '';

        // You can add the task to the DOM, send it to the server, etc.
    } else {
        // If the input is empty, you might want to alert the user
        console.log('Please enter a task.');
    }
});


