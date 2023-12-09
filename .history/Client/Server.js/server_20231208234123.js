// server.js
const express = require('express');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/taskManager', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the Task schema
const taskSchema = new mongoose.Schema({
    id: Number,
    name: String,
    completed: Boolean
});

// Create the Task model
const Task = mongoose.model('Task', taskSchema);

// Create an Express.js app
const app = express();

// Define the route for getting all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start the server
app.listen(3000, () => console.log('Server started'));