#include "VM.h"

VM::VM()
{
    running = true;
}

VM::VM(int n)
{
    node = n;
    running = true;
}

bool VM::is_running()
{
    return running;
}

std::vector<int> VM::getO()
{
    return o;
}

void VM::setO(std::vector<int> o)
{
    this->o = o;
}

int VM::getHost()
{
    return node;
}

void VM::setTask(Task t)
{
    task = t;
}

Task VM::getTask()
{
    return task;
}