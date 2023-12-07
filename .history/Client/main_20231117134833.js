
const getElement = (element) => document.getElementById(element);
const menuToggle = getElement('ham-menu-toggle');

document.addEventListener('DOMContentLoaded', () => {
    const currentDate = new Date();
    const today = currentDate.getDate();

    .innerHTML = today;
});



