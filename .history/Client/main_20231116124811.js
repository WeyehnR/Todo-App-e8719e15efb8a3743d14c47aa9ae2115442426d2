
const getElementById = function(id) {
const menuToggle = document.getElementById('menuToggle');

document.getElementById('menuToggle').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
});


