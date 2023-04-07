const mongoose = require('mongoose');
const Listener = require('./listener');
const dotenv = require('dotenv');
const SetupDatabase = require('./setupDatabase');

process.on('uncaughtException', (err) => {
  console.log('UNHANDLED REJECTION!');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './.env' }); //variables should be read before app is initialized

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection succesful!'));

const listener = new Listener();
const setupDatabase = new SetupDatabase();
await setupDatabase.setup();
listener.updateUsage();
listener.updateResult();
listener.taskRun();
