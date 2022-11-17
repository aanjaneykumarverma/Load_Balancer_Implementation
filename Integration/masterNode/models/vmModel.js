const mongoose = require("mongoose");

const vmSchema = new mongoose.Schema(
  {
    host: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Host",
        required: [true, "A VM must belong to a host."],
      },
    ],
    cpu: {
      type: Number,
      default: 0.0,
    },
    memory: {
      type: Number,
      default: 0.0,
    },
    task: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Task",
        required: [true, "A VM must have a task."],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const VM = mongoose.model("VM", vmSchema);

module.exports = VM;
