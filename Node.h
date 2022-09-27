#ifndef NODE_H
#define NODE_H
#include "VM.h"
#include <vector>
class Node
{
private:
    int p;
    std::vector<double> u;
    std::vector<VM> v;

public:
    Node();
    Node(int);
    int getp();
    void addVM(VM vm);
    std::vector<VM> getVM();
    std::vector<double> getU();
};
#endif