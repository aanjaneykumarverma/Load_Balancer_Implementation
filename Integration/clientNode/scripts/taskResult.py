import socket
import os
import subprocess
import json
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
# connect() for UDP doesn't send packets
s.connect(('10.0.0.0', 0))
IPAddr = s.getsockname()[0]
s.close()


def file_reader(file_name):
    with open(file_name) as f:
        lines = f.readlines()
        return lines


def helper(out):
    return out.split(":")[-1].split("}")[0]


data = file_reader("taskPID.txt")
parsed_data = []
for i in range(len(data)):
    if data[i] != "\n":
        parsed_data.append(data[i])

# pwd="/media/kaushal/DATA/Load_Balancer_Implementation/rabbitmq-queue/slave"
pwd = os.path.abspath("scripts")

tasks = {}
results = {}
results["taskRes"] = []
command = '{"execute": "guest-exec-status", "arguments": {"pid": ****** } }'
for i in range(0, len(parsed_data)-1, 2):
    print(parsed_data[i], parsed_data[i+1])
    pid = helper(parsed_data[i+1])
    vmName = parsed_data[i].split("\\")[0]
    os.environ['vm_name'] = vmName
    os.environ['pid'] = pid
    command = command.replace("******", str(pid))
    os.environ['command'] = command
    rc = subprocess.call("./resultCheckScript.sh")

    result = {}
    result["vmName"] = vmName.rstrip('\n')
    data = file_reader("tasksOutput.txt")
    path = os.path.join(pwd, "tasksOutput.txt")
    os.remove(path)
    result["output"] = data[0].rstrip('\n')
    results["taskRes"].append(result)
#location1 = "/media/kaushal/DATA/Load_Balancer_Implementation/Integration/clientNode/"
location1 = os.path.abspath("clientNode")
path1 = os.path.join(location1, "results.json")
with open(path1, "w+") as outfile:
    json.dump(results, outfile)
print(results)
