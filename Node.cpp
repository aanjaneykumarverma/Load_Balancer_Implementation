#include <vector>
#include "Node.h"
#include "VM.h"

Node::Node()
{
    p = 1;
    u.resize(p);
}

Node::Node(int p)
{
    this->p = p;
    u.resize(p);
}

int Node::getp()
{
    return p;
}

void Node::addVM(VM vm)
{
    v.push_back(vm);
}

std::vector<VM> Node::getVM()
{
    return v;
}

std::vector<double> Node::getU()
{
    return u;
}