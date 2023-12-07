import express from 'express'

import './styles/main.scss'


document.getElementById('menuToggle').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
});

const app = express();

app.get('/favicon.ico', (req, res) => res.status(204));
