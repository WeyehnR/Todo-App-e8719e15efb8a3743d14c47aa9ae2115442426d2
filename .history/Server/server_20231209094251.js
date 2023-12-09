// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

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

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

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