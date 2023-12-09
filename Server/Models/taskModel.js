// taskModel.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
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
    default: Date.now
  },
  selectedTime: {
    type: String,
    default: 'No Time Set'
  },
  selectedTags: [String],
  isCompleted: {
    type: Boolean,
    default: false
  },
  subtasks: [{
    name: String,
    isCompleted: Boolean
  }]
});

module.exports = mongoose.model('Task', taskSchema);
