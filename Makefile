all: schedulingPolicy

schedulingPolicy: schedulingPolicy.o Node.o VM.o
	g++ --std=c++17 -o schedulingPolicy schedulingPolicy.o Node.o VM.o

Node.o: Node.cpp Node.h
	g++ --std=c++17 -c Node.cpp

VM.o: VM.cpp VM.h
	g++ --std=c++17 -c VM.cpp

schedulingPolicy.o: schedulingPolicy.cpp
	g++ --std=c++17 -c schedulingPolicy.cpp



