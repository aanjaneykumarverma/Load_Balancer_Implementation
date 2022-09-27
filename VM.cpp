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