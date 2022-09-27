#ifndef VM_H
#define VM_H
#include <vector>
class VM
{
private:
    int node;
    bool running;
    std::vector<int> o;

public:
    VM();
    VM(int);
    bool is_running();
    std::vector<int> getO();
};

#endif