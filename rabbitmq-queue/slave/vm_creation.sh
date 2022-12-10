#!/bin/bash
sudo virsh net-start default
sudo virt-install --virt-type kvm --name a$name --ram 2048 --graphics vnc --noautoconsole --os-variant=ubuntu22.04 --cdrom=/media/kaushal/DATA/ubuntu-22.04.1-desktop-amd64.iso --check all=off
sudo grep pid /var/run/libvirt/qemu/$name.xml  >> name.txt
echo $name >> vm_name.txt
