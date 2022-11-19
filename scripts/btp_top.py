import re

def file_reader(file_name):
  with open(file_name) as f:
      lines = f.readlines()
      return lines
      
      
def vm_specifications(data):
  vm_cpu=[]
  vm_mem=[]
  vm=[]
  for line in data:
    if line.find("libvirt+")!=-1 and line.find("qemu-sy")!=-1:
      vm.append(line.split())
  for i in vm:
    vm_cpu.append(i[8])
    vm_mem.append(i[9])
  return vm_cpu,vm_mem


def host_specifications(data):
  host=[]
  host_specs={}
  
  for line in data:
    if line.find("MiB Mem")!=-1 :
      host.append(line.split())
  for i in host:
    host_specs['Total Memory']=i[3]
    host_specs['Free Memory']=i[5]
    host_specs['Used Memory']=i[7]
    host_specs['Buffer Memory']=i[9]
  return host_specs

data=file_reader("top.txt")


vm_cpu,vm_mem=vm_specifications(data)
host_specs=host_specifications(data)

final_dict={}
final_dict['vm_cpu']=vm_cpu
final_dict['vm_mem']=vm_mem
final_dict['host_specs']=host_specs
  
with open('file.txt','w') as data: 
      data.write(str(final_dict))

