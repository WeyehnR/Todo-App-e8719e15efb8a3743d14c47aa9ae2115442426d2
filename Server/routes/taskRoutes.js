const express = require('express');
const router = express.Router();
const taskService = require('../services/taskService'); // Adjust the path according to your project structure

// POST: Create a new task
router.post('/', async (req, res) => {
    try {
        const task = req.body;
        const newTask = await taskService.createTask(task);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Retrieve all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await taskService.getTasks();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Retrieve a task by ID
router.get('/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await taskService.getTaskById(taskId);
        if (task) {
            res.status(200).json(task);
        } else {
            res.status(404).send('Task not found');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT: Update a task by ID
router.put('/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const taskUpdates = req.body;
        const updatedTask = await taskService.updateTask(taskId, taskUpdates);
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE: Delete a task by ID
router.delete('/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        await taskService.deleteTask(taskId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
