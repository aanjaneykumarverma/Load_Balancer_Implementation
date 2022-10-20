#ifndef TASK_H
#define TASK_H
#include <vector>
class Task
{
private:
    int p;
    std::vector<int> resources;

public:
    Task();
    Task(int p);
    std::vector<int> get_resources();
    void set_resources(std::vector<int>);
    int getP();
    bool operator<(const Task &) const;
    bool operator==(const Task &) const;
};
#endif