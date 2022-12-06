#!/bin/bash

virsh -c qemu:///system qemu-agent-command ${vm_name} '{"execute": "guest-exec","arguments": { "path": "/usr/bin/ls", "arg": [ "/" ], "capture-output": true }}'