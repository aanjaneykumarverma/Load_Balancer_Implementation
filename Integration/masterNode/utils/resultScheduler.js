const HostVM = require('../models/hostVMModel');
const VM = require('../models/vmModel');
const Task = require('../models/taskModel');

const baseURL = 'http://127.0.0.1:5555/api/v1/';
const taskURL = `${baseURL}task/?result=New`;
const hostURL = `${baseURL}host/`;
const vmURL = `${baseURL}vm/`;
var i = 0;
var j = 0;
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class ResultScheduler {
  constructor(policy) {
    this.policy = policy;
  }
  async roundRobin() {
    var req_queue = await fetch(taskURL).then((response) => response.json());
    var H = await fetch(hostURL).then((response) => response.json());
    req_queue = req_queue.data.data;
    H = H.data.data;
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
      console.log(
        `Task ${task.command} assigned to Host ${i} at ip:${H[i].ip}`
      );
    }
    await delay(1000 * 5 * 60);
    await this.roundRobin();
  }
  async weightedRoundRobin() {
    var req_queue = await fetch(taskURL).then((response) => response.json());
    var H = await fetch(hostURL).then((response) => response.json());
    req_queue = req_queue.data.data;
    H = H.data.data;
    const N = H.length;
    // cpu+memory = weight for host
    H.sort(function (a, b) {
      if (a.cpu + a.memory >= b.cpu + b.memory) {
        return 1;
      }
      return 0;
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
      console.log(
        `Task ${task.command} assigned to Host ${i} at ip:${H[i].ip}`
      );
    }
    await delay(1000 * 5 * 60);
    await this.weightedRoundRobin();
  }
  async probabilisticScheduling() {
    var req_queue = await fetch(taskURL).then((response) => response.json());
    req_queue = req_queue.data.data;
    if (req_queue != undefined && req_queue.length != 0) {
      var H = await fetch(hostURL).then((response) => response.json());
      var V = await VM.find({ inUse: true });
      H = H.data.data;
      V = V.data.data;
      const N = H.length;
      const M = V.length;
      for (let k = 0; k < req_queue.length; k++) {
        const task = req_queue[k];
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
              sumoj += V[j][i];
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
        if (req_queue.length === 1) {
          score = score.sort().reverse();
          host = score[0][0];
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
        console.log(
          `Task ${task.command} assigned to Host ${host} at ip:${H[host].ip}`
        );
      }
    }
    await delay(1000 * 5 * 60);
    await this.probabilisticScheduling();
  }

  schedule() {
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
        console.log('INVALID POLICY!!!');
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
}

module.exports = ResultScheduler;
