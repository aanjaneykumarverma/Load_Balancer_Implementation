const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  command: {
    type: String,
    required: [true, 'A Task must have a command.'],
  },
  arguments: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['New', 'Pending', 'Completed'],
    default: 'New',
  },
  result: {
    type: String,
    default: '',
  },
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
