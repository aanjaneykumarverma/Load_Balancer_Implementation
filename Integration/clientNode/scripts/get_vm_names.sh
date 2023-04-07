#!/bin/bash
output = $(virsh list --all | awk '{print $2}')
echo "$output" | grep -v "kali" | grep -v "win10" >> ./scripts/vm_name.txt
