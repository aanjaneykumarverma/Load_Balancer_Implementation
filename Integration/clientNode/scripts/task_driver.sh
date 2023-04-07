#!/bin/bash
echo $1 >> ./scripts/taskPID.txt
virsh -c qemu:///system qemu-agent-command $1 $2 >> ./scripts/taskPID.txt

