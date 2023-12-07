
const getElement = (element) => document.getElementById(element);
const menuToggle = getElement('menuToggle');

document.addEventListener('DOMContentLoaded', () => {
    const currentDate = new Date();
    const today = currentDate.getDate();

    document.getElementById('date-header').innerHTML = today;
});



