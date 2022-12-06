#!/bin/bash
sudo virsh net-start default
sudo virt-install --virt-type kvm --name r --ram 2048 --graphics vnc --noautoconsole --os-variant=ubuntu22.04 --cdrom=/media/kaushal/DATA/ubuntu-22.04.1-desktop-amd64.iso --check all=off
