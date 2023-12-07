
const getElement = (element) => document.getElementById(element);
const menuToggle = getElement('menuToggle');
const addTaskButton = getElement('addTaskButton');
const newTask

document.getElementById('menuToggle').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
});


