#include <vector>
#include "Node.h"
#include "VM.h"

Node::Node()
{
    p = 1;
    u.resize(p);
    std::fill(u.begin(), u.end(), 0);
}

Node::Node(int p)
{
    this->p = p;
    u.resize(p);
    std::fill(u.begin(), u.end(), 0);
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

void Node::set_resources(std::vector<int> r)
{
    resources = r;
}

std::vector<int> Node::get_resources()
{
    return resources;
}

void Node::updateU(VM v, bool add)
{
    auto r = v.getO();
    for (int i = 0; i < p; i++)
    {
        if (add)
            u[i] += r[i] / double(100);
        else
            u[i] -= r[i] / double(100);
    }
}