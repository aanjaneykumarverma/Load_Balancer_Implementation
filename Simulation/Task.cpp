#include "Task.h"

Task::Task()
{
    p = 1;
    resources.resize(p);
}

Task::Task(int p)
{
    this->p = p;
    resources.resize(p);
}

void Task::set_resources(std::vector<int> r)
{
    resources = r;
}

std::vector<int> Task::get_resources()
{
    return resources;
}

int Task::getP()
{
    return p;
}

bool Task::operator<(const Task &t) const
{
    return this->p < t.p;
}

bool Task::operator==(const Task &t) const
{
    if (this->p != t.p)
        return false;
    if (this->resources != t.resources)
        return false;
    return true;
}
