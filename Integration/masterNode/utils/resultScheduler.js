const HostVM = require('../models/hostVMModel');
const VM = require('../models/vmModel');
const Task = require('../models/taskModel');
const Host = require('../models/hostModel');
const Requests = require('../models/requestModel');

var i = 0;
var j = 0;
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = function taskCommandBuilder(vmId, fileName) {
  const command = {
    execute: 'guest-exec',
    arguments: {
      path: `${fileName}`,
      arg: [`${vmId}`],
      'capture-output': true,
    },
  };
  const commandString = JSON.stringify(command);
  return commandString;
};

function resourceAtIndex(vm, index) {
  switch (index) {
    case 0:
      return vm.cpu;
    case 1:
      return vm.memory;
    default:
      return null;
  }
}

class ResultScheduler {
  constructor(policy, p = 2) {
    this.policy = policy;
    this.p = p;
  }
  roulette_wheel(score) {
    var N = score.length;
    var sum = 0.0;
    for (let i = 0; i < N; i++) {
      sum += score[i][0];
    }
    var P = new Array(N).fill(0.0);
    var PP = new Array(N + 1).fill(0.0);
    for (let i = 0; i < N; i++) {
      P[i] = score[i][0] / sum;
      PP[i + 1] = PP[i] + P[i];
    }
    const random_num = Math.random();
    var host = -1;
    for (let i = 1; i <= N; i++) {
      if (PP[i - 1] <= random_num && random_num < PP[i]) {
        host = i;
        break;
      }
    }
    return host - 1;
  }
  async roundRobin() {
    var req_queue = await Task.find({ status: 'New' });
    var H = await Host.find();
    const N = H.length;
    while (req_queue != undefined && req_queue.length != 0) {
      var task = req_queue.shift();
      await Task.findByIdAndUpdate(task._id, { status: 'Pending' });
      var freeVM = await HostVM.findOne({ host: H[i]._id });
      await VM.findByIdAndUpdate(freeVM.vm._id, {
        task: task._id,
        inUse: true,
      });
      await HostVM.findByIdAndDelete(freeVM._id);
      i++;
      i %= N;
      await Requests.create({
        host: H[i].ip,
        reqtype: 'run_task',
        args: `${vmName} ${taskCommandBuilder(freeVM.vm._id, task.command)}`,
      });
      await Task.findByIdAndUpdate(task._id, { taskScheduledAt: Date.now() });
      console.log(
        `Task ${task.command} assigned to Host ${i} at ip:${H[i].ip}`
      );
    }
    await delay(1000 * 5 * 60);
    await this.roundRobin();
  }
  async weightedRoundRobin() {
    var req_queue = await Task.find({ status: 'New' });
    var H = await Host.find();
    const N = H.length;
    // cpu+memory = weight for host
    H.sort(function (a, b) {
      return a.cpu + a.memory - b.cpu - b.memory;
    });
    while (req_queue != undefined && req_queue.length != 0) {
      var task = req_queue.shift();
      await Task.findByIdAndUpdate(task._id, { status: 'Pending' });
      var freeVM = await HostVM.findOne({ host: H[j]._id });
      await VM.findByIdAndUpdate(freeVM.vm._id, {
        task: task._id,
        inUse: true,
      });
      await HostVM.findByIdAndDelete(freeVM._id);
      j++;
      j %= N;
      await Requests.create({
        host: H[j].ip,
        reqtype: 'run_task',
        args: `${vmName} ${taskCommandBuilder(freeVM.vm._id, task.command)}`,
      });
      await Task.findByIdAndUpdate(task._id, { taskScheduledAt: Date.now() });
      console.log(
        `Task ${task.command} assigned to Host ${j} at ip:${H[j].ip}`
      );
    }
    await delay(1000 * 5 * 60);
    await this.weightedRoundRobin();
  }
  async probabilisticScheduling() {
    var req_queue = await Task.find({ status: 'New' });
    if (req_queue != undefined && req_queue.length != 0) {
      var H = await Host.find();
      var V = await VM.find({ inUse: true });
      const N = H.length;
      const M = V.length;
      while (req_queue.length != 0) {
        const currentLength = req_queue.length;
        const task = req_queue.shift();
        var w = new Array(this.p).fill(0.0);
        var score = new Array(N).fill([]);
        var totsumo = 0.0;
        for (let i = 0; i < this.p; i++) {
          if (M === 0) {
            w[i] = 1 / this.p;
          } else {
            var sumoj = 0.0;
            for (let j = 0; j < M; j++) {
              const vm = V[j];
              sumoj += resourceAtIndex(V[j], i);
            }
            totsumo += sumoj;
            w[i] = sumoj;
          }
        }
        if (V != undefined && M != 0) {
          for (let i = 0; i < this.p; i++) {
            w[i] /= totsumo;
          }
        }
        for (let j = 0; j < N; j++) {
          score[j] = [0.0, j];
          var u = [H[j].cpu, H[j].memory];
          for (let i = 0; i < this.p; i++) {
            score[j][0] += w[i] * (1 - u[i] / 100);
          }
        }
        var host;
        if (currentLength === 1) {
          score = score.sort().reverse();
          host = score[0][1];
        } else {
          host = this.roulette_wheel(score);
        }
        await Task.findByIdAndUpdate(task._id, { status: 'Pending' });
        var freeVM = await HostVM.findOne({ host: H[host]._id });
        await VM.findByIdAndUpdate(freeVM.vm._id, {
          task: task._id,
          inUse: true,
        });
        await HostVM.findByIdAndDelete(freeVM._id);
        await Requests.create({
          host: H[host].ip,
          reqtype: 'run_task',
          args: `${vmName} ${taskCommandBuilder(freeVM.vm._id, task.command)}`,
        });
        await Task.findByIdAndUpdate(task._id, { taskScheduledAt: Date.now() });
        console.log(
          `Task ${task.command} assigned to Host ${host} at ip:${H[host].ip}`
        );
      }
    }
    await delay(1000 * 5 * 60);
    await this.probabilisticScheduling();
  }

  async schedule() {
    switch (this.policy) {
      case 'ROUND_ROBIN':
        this.roundRobin();
        break;
      case 'WEIGHTED_ROUND_ROBIN':
        this.weightedRoundRobin();
        break;
      case 'PROBABILISTIC_SCHEDULING':
        this.probabilisticScheduling();
        break;
      default:
        console.error('Error: ', 'INVALID POLICY!!!');
        process.exit(1);
    }
  }
  async cleanUpVMs() {
    var tasks = await Task.find({ status: 'Completed' });
    for (let i = 0; i < tasks.length; i++) {
      var vm = await VM.find({ task: tasks[i]._id });
      var host = vm.host;
      await VM.findOneAndUpdate(
        { task: tasks[i]._id },
        { inUse: false, task: null }
      );
      await HostVM.create({ vm: vm._id, host });
    }
    await delay(1000 * 5 * 60);
    this.cleanUpVMs();
  }
  async updateStats() {
    var H = await Host.find();
    const N = H.length;
    for (let i = 0; i < N; i++) {
      await Requests.create({
        host: H[i].ip,
        reqtype: 'getInfo',
      });
    }
    await delay(1000 * 1 * 60);
    await this.checkUsage();
  }
  async checkResult() {
    var H = await Host.find();
    const N = H.length;
    for (let i = 0; i < N; i++) {
      await Requests.create({
        host: H[i].ip,
        reqtype: 'checkResults',
      });
    }
    await delay(1000 * 10 * 60);
    await this.checkResult();
  }
}

module.exports = ResultScheduler;
