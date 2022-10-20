#ifndef PARSER_H
#define PARSER_H
#include <vector>
#include <queue>
#include "Task.h"
#include "Node.h"
class parser
{
public:
    parser();
    bool put_data(std::string, std::queue<Task> &x, int);
    bool put_data(std::string, std::vector<Node> &x, int);
};

#endif