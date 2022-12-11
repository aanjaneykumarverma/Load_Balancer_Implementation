#!/bin/bash
echo $1 >> ./scripts/taskPID.txt
virsh -c qemu:///system qemu-agent-command $1 '{"execute": "guest-exec","arguments": { "path": "/usr/bin/ls", "arg": [ "/" ], "capture-output": true }}' >> ./scripts/taskPID.txt