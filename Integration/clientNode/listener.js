const VM = require("./models/vmModel");
const Host = require("./models/hostModel");
const Task = require("./models/taskModel");
const factory = require("./utils/handlerFactory");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class Listener {
  constructor() {}
  async taskRun() {
    const host = await factory.getOne(Host, { ip: process.env.IP });
    const vms = await factory.getAll(VM, { host, cpu: 0.0, memory: 0.0 });
    //console.log();
    if (vms != undefined && vms.length != 0) {
      const vm = vms[0];
      var cpu, memory;
      // run task on vm with shell script here
      // update cpu,memory from data obtained using top command
      await factory.updateOne(VM, { vm }, { cpu, memory });
    }
    await delay(1000 * 10);
    await this.taskRun();
  }
  async resultCheck() {
    // this function will do the following things:
    // 1. update task result to the result obtained from running the task on VM
    // 2. delete the VM from running VM list
    await delay(1000 * 10);
    await this.resultCheck();
  }
  async checkUsage() {
    // this function will check cpu and memory usage periodically and update it
    // 1. update host cpu and memory usage
    // 2. update all vms' cpu and memory usagw which are running on this host
    await delay(1000 * 10);
    await this.checkUsage();
  }
}

module.exports = Listener;
