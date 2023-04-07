const fs = require('fs');
const shell = require('shelljs');
const Task = require('../models/taskModel');

class SetupLoads {
  async setupLoads() {
    /**
     * create.py creates a load consisting of low, medium and high programs depecting their computational intensity.
     * It writes the load information in the file load.txt
     * This data is added to database in the tasks table and the client can serve it when it is scheduled.
     */
    shell.exec('python3 ./taskCreation/create.py');
    const loadFile = fs.readFileSync('./taskCreation/load.txt', 'utf8');
    let loadFileList = [];
    loadFile.split(/\r?\n/).forEach((name) => {
      if (name.length != 0) loadFileList.push(name);
    });
    for (let i = 0; i < loadFileList.length; ++i) {
      await Task.create({ command: `${loadFileList[i]}.py` });
    }
  }
}

module.exports = SetupLoads;
