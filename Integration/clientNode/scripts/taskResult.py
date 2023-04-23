import os
import subprocess
import json
import base64
from dotenv import load_dotenv




def file_reader(file_name):
    with open(file_name) as f:
        lines = f.readlines()
        return lines
def helper(out):
    return out.split(":")[-1].split("}")[0]
data = file_reader("./scripts/taskPID.txt")
parsed_data = []
for i in range(len(data)):
    if data[i] != "\n":
        parsed_data.append(data[i].replace("\n",""))
tasks = {}
results = {}
results["taskRes"] = []
vmName_list=[]
for i in range(0, len(parsed_data)-1, 2):
    command = '{"execute": "guest-exec-status", "arguments": {"pid": ****** } }'
    print(parsed_data[i], parsed_data[i+1])
    pid_dict=json.loads(parsed_data[i+1])
    pid=pid_dict["return"]["pid"]
    vmName=parsed_data[i]
    vmName_list.append(vmName)
    os.environ['vm_name'] = vmName
    os.environ['pid'] = str(pid)
    command = command.replace("******", str(pid))
    os.environ['command'] = command
    print(vmName, command, pid)
    rc = subprocess.call("./scripts/resultCheckScript.sh")


data = file_reader("./scripts/tasksOutput.txt")
output_file = []
for i in range(len(data)):
    if data[i] != "\n":
        output_file.append(data[i].replace("\n",""))
vm_num=0
for output_data in output_file:
    result={}
    out = json.loads(output_data)
    a=out["return"]["out-data"]
    base64_message = a
    base64_bytes = base64_message.encode('ascii')
    message_bytes = base64.b64decode(base64_bytes)
    message = message_bytes.decode('ascii')
    output = message.split("\n")
    starting_time = output[0].split(" at ")[1]
    ending_time = output[1].split(" at ")[1]
    result["vmName"]=vmName_list[vm_num]
    vm_num+=1
    result["output"] = a
    result["taskStartedAt"] = starting_time
    result["taskFinishedAt"] = ending_time
    results["taskRes"].append(result)


with open("./scripts/results.json", "a") as outfile:
    json.dump(results, outfile)
print(results)