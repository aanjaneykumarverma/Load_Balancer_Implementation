const fetch = require('node-fetch');
const shell = require('shelljs');
const Task = require('../models/taskModel');
const Host = require('../models/hostModel');
const VM = require('../models/vmModel');
const fs = require('fs');

const baseURL = 'http://127.0.0.1:5555/api/v1/';
const taskURL = `${baseURL}task/?result=New`;
const hostURL = `${baseURL}host/`;
const vmURL = `${baseURL}vm/`;
const idLength = 5;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function vmid(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

class Scheduler {
  constructor(p) {
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
  async schedule() {
    var req_queue = await fetch(taskURL).then((response) => response.json());
    req_queue = req_queue.data.data;
    if (req_queue != undefined && req_queue.length != 0) {
      var H = await fetch(hostURL).then((response) => response.json());
      var V = await fetch(vmURL).then((response) => response.json());
      H = H.data.data;
      V = V.data.data;
      console.log(H, V);
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

        var vmName = vmid(5);
        var stream = fs.createWriteStream(
          '../../rabbitmq-queue/master/runCommands.txt',
          { flags: 'a' }
        );
        stream.write(`${H[host].ip} create_vm ${vmName}\n`);
        stream.write(`${H[host].ip} run_task ${vmName}\n`);
        stream.end();
        shell.exec('python3 ../../rabbitmq-queue/master/sender.py');
        await VM.create({
          host: H[host]._id,
          task: task._id,
          name: vmid(idLength),
        });
        await Task.findByIdAndUpdate(task._id, { result: 'Pending' });
        console.log(`Task ${task.command} assigned to Host ${H[host].ip}`);
      }
    }
    await delay(1000 * 5 * 60);
    await this.schedule();
  }
  async setup() {
    var H = await fetch(hostURL).then((response) => response.json());
    var stream = fs.createWriteStream('../../rabbitmq-queue/master/ip.txt');
    H = H.data.data;
    const N = H.length;
    for (let i = 0; i < N; i++) {
      stream.write(`${H[i].ip}\n`);
    }
    stream.end();
  }
  async updateStats() {
    var H = await fetch(hostURL).then((response) => response.json());
    H = H.data.data;
    const N = H.length;
    var stream = fs.createWriteStream(
      '../../rabbitmq-queue/master/runCommands.txt',
      { flags: 'a' }
    );
    for (let i = 0; i < N; i++) {
      stream.write(`${H[i].ip} getInfo *****\n`);
    }
    stream.end();
    shell.exec('python3 ../../rabbitmq-queue/master/sender.py');
    await delay(1000 * 5 * 60);
    await this.checkUsage();
  }
  async checkResult() {
    var H = await fetch(hostURL).then((response) => response.json());
    H = H.data.data;
    const N = H.length;
    var stream = fs.createWriteStream(
      '../../rabbitmq-queue/master/runCommands.txt',
      { flags: 'a' }
    );
    for (let i = 0; i < N; i++) {
      stream.write(`${H[i].ip} checkResults *****\n`);
    }
    stream.end();
    shell.exec('python3 ../../rabbitmq-queue/master/sender.py');
    await delay(1000 * 10 * 60);
    await this.checkResult();
  }
}

module.exports = Scheduler;
