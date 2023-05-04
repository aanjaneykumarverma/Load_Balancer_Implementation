const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('../models/taskModel');
const VM = require('../models/vmModel');
const Host = require('../models/hostModel');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'Probalistic_Scheduling.csv',
  header: [
    { id: 'host', title: 'host' },
    { id: 'cpu', title: 'cpu' },
    { id: 'memory', title: 'memory' },
    { id: 'command', title: 'taskType' },
    { id: 'taskCreatedAt', title: 'taskCreatedAt' },
    { id: 'taskScheduledAt', title: 'taskScheduledAt' },
    { id: 'taskReceivedAt', title: 'taskReceivedAt' },
    { id: 'taskStartedAt', title: 'taskStartedAt' },
    { id: 'taskFinishedAt', title: 'taskFinishedAt' },
  ],
});

const hostIDMap = new Map();
var currentID = 1;

process.on('uncaughtException', (err) => {
  console.log('UNHANDLED REJECTION!');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: '../.env' }); //varibles should be read before app is initialized
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection succesful!'));

async function getResultsFromDB() {
  csvWriter
    .writeHeader()
    .then(() => console.log('CSV file header written successfully'))
    .catch((error) => console.error(error));

  const vms = await VM.find();
  for (let i = 0; i < vms.length; ++i) {
    const vm = vms[i];
    const task = await Task.find(vm.task);
    const host = await Host.find(vm.host);
    if (hostIDMap.has(host._id) != true) {
      hostIDMap.set(host._id, currentID);
      currentID = currentID + 1;
    }
    const record = {
      host: hostIDMap.get(host._id),
      cpu: host.cpu,
      memory: host.memory,
      command: task.command,
      taskCreatedAt: task.taskCreatedAt,
      taskScheduledAt: task.taskScheduledAt,
      taskReceivedAt: task.taskReceivedAt,
      taskStartedAt: task.taskStartedAt,
      taskFinishedAt: task.taskFinishedAt,
    };
    csvWriter
      .writeRecord(record)
      .then(() => console.log(`Record ${i + 1} written successfully.`))
      .catch((error) => console.error(error));
  }

  csvWriter
    .end()
    .then(() => console.log('CSV file closed successfully'))
    .catch((error) => console.error('Error closing CSV file:', error));
}

getResultsFromDB();
