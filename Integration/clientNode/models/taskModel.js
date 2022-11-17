const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    command: {
      type: String,
      required: [true, "A Task must have a command."],
    },
    arguments: {
      type: String,
      default: "",
    },
    result: {
      type: String,
      default: "Not Scheduled",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
