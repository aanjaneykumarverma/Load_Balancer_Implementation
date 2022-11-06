
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include "parser.h"
using namespace std;

parser::parser()
{
}

bool parser::put_data(string fname, queue<Task> &v, int n)
{
    vector<int> data[n];
    vector<string> row;
    string line, word;
    fstream file(fname, ios::in);
    if (file.is_open())
    {
        getline(file, line);
        while (getline(file, line))
        {
            stringstream str(line);
            int i = 0;
            while (getline(str, word, ','))
            {
                if (i <= n && i)
                    data[i - 1].push_back(stoi(word));
                i++;
            }
        }
        for (int j = 0; j < data[0].size(); j++)
        {
            vector<int> resources;
            for (int i = 0; i < n; i++)
                resources.push_back(data[i][j]);
            Task obj(n);
            obj.set_resources(resources);
            v.push(obj);
        }
        return true;
    }
    else
        return false;
}

bool parser::put_data(string fname, vector<Node> &v, int n)
{
    vector<int> data[n];
    vector<string> row;
    string line, word;
    fstream file(fname, ios::in);
    if (file.is_open())
    {
        getline(file, line);
        while (getline(file, line))
        {
            stringstream str(line);
            int i = 0;
            while (getline(str, word, ','))
            {
                if (i <= n && i)
                    data[i - 1].push_back(stoi(word));
                i++;
            }
        }
        for (int j = 0; j < data[0].size(); j++)
        {
            vector<int> resources;
            for (int i = 0; i < n; i++)
                resources.push_back(data[i][j]);
            Node obj(n);
            obj.set_resources(resources);
            v.push_back(obj);
        }
        return true;
    }
    else
        return false;
}
