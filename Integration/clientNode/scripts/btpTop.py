import json
import socket
hostname = socket.gethostname()

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(('10.0.0.0', 0))
IPAddr = s.getsockname()[0]
s.close()


def file_reader(file_name):
    with open(file_name) as f:
        lines = f.readlines()
        return lines


def vm_specifications(data, pid):
    for line in data:
        if line.find("libvirt+") != -1 and line.find("qemu-sy") != -1 and line.find(pid) != -1:
            i = line.split()
            return i[8], i[9]


def host_specifications(data):
    host = []
    host_specs = {}

    for line in data:
        if line.find("MiB Mem") != -1:
            host.append(line.split())
    for i in host:
        host_specs['Total Memory Usage'] = float(total_mem)
        host_specs['CPU Usage'] = float(cpu_usage)
        host_specs['IP'] = str(IPAddr)
    return host_specs


vm_pid = file_reader("./scripts/name.txt")
vm_names = file_reader("./scripts/vm_name.txt")
names = []
pid_list = []
for i in vm_pid:
    if i.find('booted') != -1:
        a = i.split("'")
        pid_list.append(a[len(a)-2])

for i in vm_names:
    names.append(i.rstrip('\n'))

data = file_reader("./scripts/top.txt")
final_dict = {}
final_dict["VMS"] = []
total_mem = 0
for pid in range(len(pid_list)):
    vm_cpu, vm_mem = vm_specifications(data, pid_list[pid])
    vm_info = {}
    vm_info["pid"] = int(pid_list[pid])
    vm_info["name"] = names[pid]
    vm_info['vm_cpu'] = float(vm_cpu)
    vm_info['vm_mem'] = float(vm_mem)
    total_mem = max(total_mem, float(vm_mem))
    final_dict["VMS"].append(vm_info)
cpu_data = file_reader("./scripts/cpu.txt")

cpu_usage = float(cpu_data[0].split("%")[0])
host_specs = host_specifications(data)

final_dict['host_specs'] = host_specs

with open("./scripts/host_info.json", "w+") as outfile:
    json.dump(final_dict, outfile)
