
const getElement = (element) => document.getElementById(element);
const menuToggle = getElement('');

document.addEventListener('DOMContentLoaded', () => {
    const currentDate = new Date();
    const today = currentDate.getDate();

    document.getElementById('date-header').innerHTML = today;
});



