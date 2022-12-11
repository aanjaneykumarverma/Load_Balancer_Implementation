#!/bin/bash
echo "ubuntu22.04" >> taskPID.txt
virsh -c qemu:///system qemu-agent-command ubuntu22.04 '{"execute": "guest-exec","arguments": { "path": "/usr/bin/ls", "arg": [ "/" ], "capture-output": true }}' >> taskPID.txt