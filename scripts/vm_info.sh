#!/bin/bash
# getting the cpu usage and memory usage of different vms runnning on the host
top -b -n 1 > top.txt
#running the python code to extract the information of the vms and saving them on the slave node so that we can transmit this information to the master node for running the scheduling algorithm.
python3 btp_top.py
# removing the top.txt file so that next time the information is not overwritten.
rm top.txt
