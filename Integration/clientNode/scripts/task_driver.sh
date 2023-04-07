#!/bin/bash
echo $1 >> ./scripts/taskPID.txt

if [ "$2" == "high"]; then
    virsh -c qemu:///system qemu-agent-command $1 '{"execute": "guest-exec","arguments": { "path": "high.py", "arg": [ "/" ], "capture-output": true }}' >> ./scripts/taskPID.txt
elif [ "$2" == "medium"]; then
    virsh -c qemu:///system qemu-agent-command $1 '{"execute": "guest-exec","arguments": { "path": "medium.py", "arg": [ "/" ], "capture-output": true }}' >> ./scripts/taskPID.txt
elif [ "$2" == "low"]; then
    virsh -c qemu:///system qemu-agent-command $1 '{"execute": "guest-exec","arguments": { "path": "low.py", "arg": [ "/" ], "capture-output": true }}' >> ./scripts/taskPID.txt
else
    echo "Invalid argument: $2"
    exit 1
fi
exit 0