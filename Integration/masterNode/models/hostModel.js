const mongoose = require('mongoose');

const hostSchema = new mongoose.Schema(
  {
    cpu: {
      type: Number,
      required: [true, 'A host must have cpu usage.'],
    },
    memory: {
      type: Number,
      required: [true, 'A host must have memory usage.'],
    },
    ip: {
      type: String,
      required: [true, 'A host must have an IP address.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

hostSchema.virtual('VMs', {
  ref: 'VM',
  foreignField: 'host', // the connecting fields name in the host database
  localField: '_id', // the connecting fields name in the current database
});

hostSchema.index({ ip: 1 }, { sparse: true });

const Host = mongoose.model('Host', hostSchema);
module.exports = Host;
