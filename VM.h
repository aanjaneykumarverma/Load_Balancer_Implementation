#ifndef VM_H
#define VM_H
#include <vector>
#include "Task.h"
class VM
{
private:
    int node;
    bool running;
    Task task;
    std::vector<int> o;

public:
    VM();
    VM(int);
    bool is_running();
    std::vector<int> getO();
    void setO(std::vector<int>);
    int getHost();
    Task getTask();
    void setTask(Task);
};

#endif