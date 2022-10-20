all: schedulingPolicy.out

schedulingPolicy.out: schedulingPolicy.o Node.o VM.o Task.o parser.o
	g++ --std=c++17 -o schedulingPolicy.out schedulingPolicy.o Node.o VM.o Task.o parser.o

Node.o: Node.cpp Node.h
	g++ --std=c++17 -c Node.cpp

VM.o: VM.cpp VM.h
	g++ --std=c++17 -c VM.cpp

Task.o: Task.cpp Task.h
	g++ --std=c++17 -c Task.cpp

parser.o: parser.cpp parser.h
	g++ --std=c++17 -c parser.cpp

schedulingPolicy.o: schedulingPolicy.cpp
	g++ --std=c++17 -c schedulingPolicy.cpp



