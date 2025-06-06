// taskModel.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'No name set'
  },
  description: {
    type: String,
    default: 'Task Description'
  },
  selectedList: {
    type: String,
    default: 'Default List'
  },
  selectedDueDate: {
    type: Date,
    default: 'No Due Date Selected'
  },
  selectedTime: {
    type: String,
    default: 'No Time Set'
  },
  selectedTags:  {
    type: String,
    default: 'No Tag Selected'
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  subtasks: [{
    id: Number,
    name: String,
    isCompleted: Boolean
  }]
});

module.exports = mongoose.model('Task', taskSchema);
