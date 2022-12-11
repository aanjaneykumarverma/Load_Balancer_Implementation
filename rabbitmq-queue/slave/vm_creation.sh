#!/bin/bash
sudo virt-install --virt-type kvm --name $vm_name --ram 2048 --graphics vnc --noautoconsole --os-variant=ubuntu22.04 --cdrom=/media/kaushal/DATA/ubuntu-22.04.1-desktop-amd64.iso --check all=off
sudo grep pid /var/run/libvirt/qemu/$vm_name.xml  >> name.txt
echo $vm_name >> vm_name.txt
