#!/bin/bash
sudo virt-install --virt-type kvm --name $1 --ram 2048 --graphics vnc --noautoconsole --os-variant=ubuntu22.04 --cdrom=$2 --check all=off
sudo grep pid /var/run/libvirt/qemu/$1.xml  >> ./scripts/name.txt
echo $1 >> ./scripts/vm_name.txt

