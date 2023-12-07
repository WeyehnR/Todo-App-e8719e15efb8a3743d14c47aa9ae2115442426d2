
const getElement = (element) => document.getElementById(element);
const menuToggle = getElement('ham-menu-');

document.addEventListener('DOMContentLoaded', () => {
    const currentDate = new Date();
    const today = currentDate.getDate();

    document.getElementById('date-header').innerHTML = today;
});



