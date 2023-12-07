
const getElement = (element) => document.getElementById(element);
const menuToggle = getElement('menuToggle');
const addTaskButton = getElement('addTaskButton');
const newTaskInput = getElement('newTaskInput');
const sidebar = getElement('sidebar');
const grayCard = getElement('grayCard');
const content = document.querySelector('.content');

document.addEventListener('DOMContentLoaded', () => {
    const currentDate = new Date();
    const today = currentDate.getDate();

    document.getElementById('date-header').innerHTML = today;
});



