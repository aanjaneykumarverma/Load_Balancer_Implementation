const fs = require('fs');
const shell = require('shelljs');
const dotenv = require('dotenv');
const Host = require('./models/hostModel');
const VM = require('./models/vmModel');
const HostVM = require('./models/hostVMModel');

dotenv.config({ path: './.env' });

class SetupDatabase {
  async setup() {
    /**
     * First we create 10 VMs on the client node using vm_creation.sh script.
     * It populates the pid of VMs in name.txt & their names in vm_name.txt.
     * We then run the vmInfo.sh script which fetches the details of all the VMs on the host.
     * It also gets us the current cpu & memory usage of the host.
     * Then the client registers itself with the master node by making an entry in the database.
     * These vms are then entered in the database inside the hostvms & vms table.
     * All vms inside hostvms table are free and not running any tasks.
     **/
    console.info('Database is being set up.');
    // for (let i = 0; i < 10; ++i) {
    //   shell.exec(`bash ./scripts/vm_creation.sh vm${i + 1} ${process.env.ISOPATH}`);
    // }
    shell.exec('bash ./scripts/vmInfo.sh');
    const obj = JSON.parse(fs.readFileSync('./scripts/host_info.json', 'utf8'));
    const vmList = obj['VMS'];
    const hostInfo = obj['host_specs'];
    const host = await Host.create({
      cpu: Number(hostInfo['Total Memory Usage']),
      memory: Number(hostInfo['CPU Usage']),
      ip: `${process.env.IP}`,
    });
    for (let i = 0; i < vmList.length; ++i) {
      const curVM = vmList[i];
      const vm = await VM.create(
        { host: host._id, 
          name: curVM.name ,
          cpu: Number(curVM.vm_cpu),
          memory: Number(curVM.vm_mem),
        }
      );
      await HostVM.create({ host: host._id, vm: vm._id });
    }
    console.info('Database setup finished successfully.');
  }
}

module.exports = SetupDatabase;
