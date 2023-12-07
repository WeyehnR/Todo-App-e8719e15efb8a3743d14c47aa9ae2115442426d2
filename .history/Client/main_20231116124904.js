
const getElement = (element) => document.getElementById(element);
const menuToggle = getElement('menuToggle');

document.getElementById('menuToggle').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
});


