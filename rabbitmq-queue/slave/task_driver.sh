#!/bin/bash
echo ${vm_name} >> taskPID.txt
virsh -c qemu:///system qemu-agent-command ${vm_name} '{"execute": "guest-exec","arguments": { "path": "/usr/bin/ls", "arg": [ "/" ], "capture-output": true }}' >> taskPID.txt