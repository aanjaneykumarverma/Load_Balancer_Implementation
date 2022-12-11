const mongoose = require('mongoose');

const vmSchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.ObjectId,
      ref: 'Host',
      required: [true, 'A VM must belong to a host.'],
    },
    name: {
      type: String,
      required: [true, 'A VM must have a name.'],
    },
    cpu: {
      type: Number,
      default: 0.0,
    },
    memory: {
      type: Number,
      default: 0.0,
    },
    task: {
      type: mongoose.Schema.ObjectId,
      ref: 'Task',
      required: [true, 'A VM must have a task.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

vmSchema.index({ host: 1, name: 1 }, { unique: true });

const VM = mongoose.model('VM', vmSchema);
module.exports = VM;
