const mongoose = require('mongoose');

const hostVMSchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.ObjectId,
      ref: 'Host',
    },
    vm: {
      type: mongoose.Schema.ObjectId,
      ref: 'VM',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const HostVM = mongoose.model('HostVM', hostVMSchema);
module.exports = HostVM;
