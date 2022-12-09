const fs = require('fs');
const shell = require('shelljs');
const dotenv = require('dotenv');
const VM = require('./models/vmModel');
const Host = require('./models/hostModel');
const Task = require('./models/taskModel');
const factory = require('./utils/handlerFactory');

dotenv.config({ path: './.env' });
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class Listener {
  constructor() {}
  async taskRun() {
    const host = await factory.getOne(Host, { ip: process.env.IP });
    const vms = await factory.getAll(VM, { host, cpu: 0.0, memory: 0.0 });
    if (vms != undefined && vms.length != 0) {
      const vm = vms[0];
      var cpu, memory;
      // run task on vm with shell script here
      var command = `'{"execute":"guest-exec", "arguments":{"path":"/usr/bin/${vm.task}","arg":["/"],"capture-output":true}}'`;
      shell.exec(`./scripts/vmRuntask.sh ${vm.name} ${command}`);
      // update cpu,memory from data obtained using top command
      await factory.updateOne(VM, { vm }, { cpu, memory });
    }
    await delay(1000 * 10);
    await this.taskRun();
  }
  async resultCheck() {
    // this function will do the following things:
    // get a file of the from vmname taskResult
    // 1. update task result to the result obtained from running the task on VM
    // run guest-exec-status here
    // 2. delete the VMs in the file from running VM list
    await delay(1000 * 10);
    await this.resultCheck();
  }
  async checkUsage() {
    // this function will check cpu and memory usage periodically and update it
    // 1. update host cpu and memory usage
    shell.exec('./scripts/vmInfo.sh');
    // 2. update all vms' cpu and memory usagw which are running on this host
    // read file.txt
    var obj = JSON.parse(fs.readFileSync('file.json', 'utf8'));
    console.log(obj);
    // iterate over list and update in DB
    await delay(1000 * 10);
    await this.checkUsage();
  }
}

module.exports = Listener;
