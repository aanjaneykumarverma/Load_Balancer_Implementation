#!/bin/bash
# $1 stores VM name e.g. ubuntuvm
# $2 contains the guest-exec-command
virsh -c qemu:///system qemu-agent-command $1 $2

