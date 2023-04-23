#!/bin/bash
# getting the cpu usage and memory usage of different vms runnning on the host
# chmod u+x vm_info.sh to get permissions for shelljs
# sudo apt-get install sysstat for mpstat

top -b -n 1 > ./scripts/top.txt
mpstat | awk '$12 ~ /[0-9.]+/ { print $12"%" }' > ./scripts/cpu.txt
#running the python code to extract the information of the vms and saving them on the slave node so that we can transmit this information to the master node for running the scheduling algorithm.
python3 ./scripts/btpTop.py
# removing the top.txt file so that next time the information is not overwritten.
rm ./scripts/top.txt ./scripts/cpu.txt
