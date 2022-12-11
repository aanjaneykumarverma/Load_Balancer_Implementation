#!/bin/bash

virsh -c qemu:///system qemu-agent-command ${vm_name} ${command} > tasksOutput.txt
