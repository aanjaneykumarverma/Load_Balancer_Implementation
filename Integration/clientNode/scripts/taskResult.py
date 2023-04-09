import os
import subprocess
import json
import base64
from dotenv import load_dotenv

load_dotenv()
IP = os.getenv('IP')


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
        parsed_data.append(data[i])

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
    print(vmName, command, pid)
    rc = subprocess.call("./scripts/resultCheckScript.sh")
    result = {}
    result["vmName"] = vmName.rstrip('\n')
    data = file_reader("./scripts/tasksOutput.txt")
    print(data)
    output = data[0].rstrip('\n')
    output = output[10:]
    output = output[:-2]
    try:
        out = json.loads(output)
    except:
        output = output+"}"
        out = json.loads(output)
    a = out["out-data"]
    base64_message = a
    base64_bytes = base64_message.encode('ascii')
    message_bytes = base64.b64decode(base64_bytes)
    message = message_bytes.decode('ascii')
    output = message.split("\n")
    starting_time = output[0].split(" at ")[1]
    ending_time = output[1].split(" at ")[1]
    result["output"] = data[0].rstrip('\n')
    result["taskStartedAt"] = starting_time
    result["taskFinishedAt"] = ending_time
    results["taskRes"].append(result)


with open("./scripts/results.json", "w+") as outfile:
    json.dump(results, outfile)
print(results)
