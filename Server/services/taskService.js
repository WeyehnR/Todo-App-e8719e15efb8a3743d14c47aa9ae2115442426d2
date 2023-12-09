// taskService.js
const { ObjectId } = require('mongodb');
const dbConnect = require('../dbConnect');

const createTask = async (taskData) => {
  const db = dbConnect.getDb();
  const result = await db.collection('tasks').insertOne(taskData);
  return result;
};

const getTasks = async () => {
  const db = dbConnect.getDb();
  const tasks = await db.collection('tasks').find({}).toArray();
  return tasks;
};

const getTaskById = async (taskId) => {
  const db = dbConnect.getDb();
  const task = await db.collection('tasks').findOne({ _id: ObjectId(taskId) });
  return task;
};

// Export functions to be used in route handlers
module.exports = {
  createTask,
  getTasks,
  getTaskById
};
