const fs = require('fs');
const shell = require('shelljs');
const VM = require('./models/vmModel');
const Host = require('./models/hostModel');
const Task = require('./models/taskModel');
const factory = require('./utils/handlerFactory');

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
    const taskResults = obj['taskRes'];
    const N = taskResults.length;
    const host = await Host.findOne({ ip: process.env.IP });
    for (let i = 0; i < N; ++i) {
      const vmName = obj['taskRes'][i].vmName;
      const taskOutput = JSON.parse(obj['taskRes'][i].output);
      const exitcode = taskOutput.return.exitcode;
      if (exitcode === 0) {
        const vm = await VM.findOne({ host: host._id, name: vmName });
        const taskID = vm.task;
        const result = taskOutput.return['out-data'];
        await Task.findByIdAndUpdate(taskID, { result });
        await VM.findByIdAndDelete(vm._id);
        const plainTextResult = Buffer.from(`${result}`, 'base64').toString(
          'utf8'
        );
      }
    }
    await delay(1000 * 5 * 60);
    await this.updateResult();
  }
  async updateUsage() {
    // this function will check cpu and memory usage periodically and update it
    const host = await Host.findOne({ ip: process.env.IP });
    var obj = JSON.parse(fs.readFileSync('host_info.json', 'utf8'));
    const vmList = obj['VMS'];
    const hostInfo = obj['host_specs'];
    await Host.findByIdAndUpdate(host._id, {
      cpu: Number(hostInfo['Total Memory Usage']),
      memory: Number(hostInfo['CPU Usage']),
    });
    for (let i = 0; i < vmList.length; ++i) {
      const curVM = vmList[i];
      const vm = await VM.findOneAndUpdate(
        { host: host._id, name: curVM.name },
        {
          cpu: Number(curVM.vm_cpu),
          memory: Number(curVM.vm_mem),
        }
      );
    }
    await delay(1000 * 1 * 60);
    await this.updateUsage();
  }
}

module.exports = Listener;
