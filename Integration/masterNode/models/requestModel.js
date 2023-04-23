const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  reqtype: {
    type: String,
    enum: ['create_vm', 'run_task', 'getInfo', 'checkResults'],
    required: [true, 'A Request must have a request type.'],
  },
  host: {
    type: String,
    required: [true, 'A Request must have a host.'],
  },
  args: {
    type: String,
    default: '',
  },
});

const Requests = mongoose.model('Request', requestSchema);
module.exports = Requests;
