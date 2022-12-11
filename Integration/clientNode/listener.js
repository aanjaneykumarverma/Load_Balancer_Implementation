const fs = require('fs');
const shell = require('shelljs');
const dotenv = require('dotenv');
const VM = require('./models/vmModel');
const Host = require('./models/hostModel');
const Task = require('./models/taskModel');
const factory = require('./utils/handlerFactory');
const { findOneAndDelete, findOneAndUpdate } = require('./models/vmModel');

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
      shell.exec(`./scripts/vmRunTask.sh ${vm.name} ${command}`);
    }
    await delay(1000 * 5 * 60);
    await this.taskRun();
  }
  async updateResult() {
    // this function will do the following things:
    // 1. update task result to the result obtained from running the task on VM
    // 2. delete the VMs in the file from running VM list
    var obj = JSON.parse(fs.readFileSync('results.json', 'utf8'));
    const vmList = obj['VMS'];
    const host = await findOne(Host, { ip: process.env.IP });
    for (let i = 0; i < vmList.length; ++i) {
      const curVM = vmList[i];
      const vm = await findOne(VM, { host, name: curVM.name });
      const taskID = vm.task;
      await findByIdAndUpdate(Task, taskID, {
        result: curVM.result.return['out-data'],
      });
      await findOneAndDelete(VM, { host, name: curVM.name });
      // console.log(curVM.result);
      // console.log(curVM.result.return['out-data']);
    }
    //const plain = Buffer.from('dXNlcm5hbWU6cGFzc3dvcmQ=', 'base64').toString('utf8')
    await delay(1000 * 5 * 60);
    await this.updateResult();
  }
  async updateUsage() {
    // this function will check cpu and memory usage periodically and update it
    const host = await findOne(Host, { ip: process.env.IP });
    var obj = JSON.parse(fs.readFileSync('host_info.json', 'utf8'));
    const vmList = obj['VMS'];
    for (let i = 0; i < vmList.length; ++i) {
      const curVM = vmList[i];
      const vm = await findOneAndUpdate(
        VM,
        { host, name: curVM.name },
        {
          cpu: curVM.vm_cpu,
          memory: curVM.vm_mem,
        }
      );
    }
    await delay(1000 * 1 * 60);
    await this.updateUsage();
  }
}

module.exports = Listener;
