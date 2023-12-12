// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const path = require('path');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Failed to connect to MongoDB', err);
});
// Define the Task schema
const taskSchema = new Schema({
    id: Number,
    name: String,
    description: String,
    selectedList: String,
    selectedDueDate: String,
    selectedTime: String,
    selectedTags: String,
    isCompleted: Boolean,
    subtasks: Array
});

// Create the Task model
const Task = model('Task', taskSchema);

// Create an Express.js app
const app = express();

// Serve static files from the 'Client/Html' directory
app.use(express.static(path.join(__dirname,'..','Client')));

// Define the route for adding a task
app.post('/api/tasks', express.json(), async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/tasks/:taskId', express.json(), async (req, res) => {
    const taskId = req.params.taskId;
    const subtask = req.body.subtasks;

    // Query the database to find the task with the given ID
    const task = await Task.findOne({ id: taskId });

    if (!task) {
        // If the task does not exist, send a 404 response
        res.status(404).send('Task not found');
    } else {
        // If the task exists, update it with the new subtask and save it
        task.subtasks.push(subtask);
        await task.save();

        // Send the updated task as the response
        res.json(task);
    }
});

// Define the route for deleting a task
app.delete('/api/tasks/:taskId', async (req, res) => {
    const taskId = Number(req.params.taskId;

    // Query the database to find the task with the given ID
    const task = await Task.findOne({ id: taskId });

    console.log('Deleting task with ID:', taskId);

    if (!task) {
        // If the task does not exist, send a 404 response
        res.status(404).send('Task not found');
    } else {
        // If the task exists, delete it
        await task.remove();

        // Send a 200 status code as the response
        res.status(200).send('Task deleted');
    }
});

// Define the route for getting all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Define the route for getting a single task
app.get('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findOne({ id: req.params.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Define the route for updating a task
app.put('/api/tasks/:id', express.json(), async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start the server
app.listen(3000, () => console.log('Server started at http://localhost:3000/Html/index.html'));