#include <iostream>
#include <vector>
#include <queue>
#include <random>
#include <chrono>
#include <thread>
#include <atomic>
#include <functional>
#include <memory>
#include <map>
#include <fstream>
#include "Node.h"
#include "VM.h"
#include "Task.h"
#include "parser.h"
#define N 10 // number of nodes
#define M 5  // number of VMs in a node
using namespace std;
using namespace std::chrono;
using cancel_token_t = std::atomic_bool;
typedef time_point<system_clock, seconds> MyTimePoint;
double random_number_generator()
{
    std::mt19937_64 rng;
    // initialize the random number generator with time-dependent seed
    uint64_t timeSeed = std::chrono::high_resolution_clock::now().time_since_epoch().count();
    std::seed_seq ss{uint32_t(timeSeed & 0xffffffff), uint32_t(timeSeed >> 32)};
    rng.seed(ss);
    // initialize a uniform distribution between 0 and 1
    std::uniform_real_distribution<double> unif(0, 1);
    // ready to generate random numbers
    return unif(rng);
}
int roulette_wheel(vector<pair<double, int>> &score)
{
    int n = score.size();
    double sum = 0;
    for (auto i : score)
        sum += i.first;
    vector<double> P(n);
    vector<double> PP(n + 1, 0);
    for (int i = 0; i < n; i++)
    {
        P[i] = score[i].first / sum;
        PP[i + 1] = PP[i] + P[i];
    }
    double random_num = random_number_generator();
    for (int i = 2; i <= n; i++)
    {
        if (PP[i - 1] <= random_num && random_num < PP[i])
            return i - 1;
    }
    return n;
}
vector<int> check_completed_tasks(map<Task, MyTimePoint> tTask, vector<Node> H, vector<VM> V, int m)
{
    vector<int> finished_vm;
    MyTimePoint endTimePoint = time_point_cast<MyTimePoint::duration>(system_clock::time_point(system_clock::now()));
    for (auto t : tTask)
    {
        auto diff = endTimePoint - t.second;
        if (diff.count())
        {
            // task is over
            for (int i = 0; i < V.size(); i++)
            {
                if (V[i].getTask() == t.first)
                {
                    finished_vm.push_back(i);
                    // int host = V[i].getHost();
                    // H[host].updateU(V[i], false);
                    // m--;
                    // V.erase(V.begin() + i);
                    // break;
                }
            }
        }
    }
    return finished_vm;
}
void clean_VM(vector<VM> &V, vector<Node> &H, int &m)
{
    ifstream file("finished_vm.txt");
    string line;
    if (file.is_open())
    {
        while (getline(file, line))
        {
            int i = line[0] - '0';
            int host = V[i].getHost();
            H[host].updateU(V[i], false);
            m--;
            V.erase(V.begin() + i);
        }
    }
    file.close();
}
template <typename Fnc>
void set_interval(Fnc fun, std::chrono::steady_clock::duration interval,
                  std::shared_ptr<cancel_token_t> cancel_token = nullptr)
{
    std::thread([fun = std::move(fun), interval, tok = std::move(cancel_token)]()
                { 
    while (!tok || !*tok) // Call until token becomes true (if it is set)
    { 
      auto next = std::chrono::steady_clock::now() + interval;
      fun();
      std::this_thread::sleep_until(next);
    } })
        .detach(); // .detach() .join() see both
}
int main()
{
    int m = 0;                    // total VMs
    int p = 2;                    // number of resources
    vector<Node> H(N);            // set of running hosts
    vector<VM> V;                 // set of running VMs
    queue<Task> req_queue;        // set of requests
    map<Task, MyTimePoint> tTask; // time taken for task completion
    parser parse;
    if (!parse.put_data("Dataset/tasks.csv", req_queue, p))
    {
        cout << "Couldn't open tasks.csv"
             << "\n";
        return 1;
    }
    if (!parse.put_data("Dataset/hosts.csv", H, p))
    {
        cout << "Couldn't open hosts.csv"
             << "\n";
        return 1;
    }
    auto cancel = std::make_shared<cancel_token_t>(false);
    set_interval([tTask, H, V, m]
                 { auto finished_vm = check_completed_tasks(tTask, H, V, m); 
                          ofstream file("finished_vm.txt");
                          for(auto i:finished_vm)
                            file<<i<<"\n";
                          file.close(); },
                 5 * 60 * 1000ms, cancel);
    while (!req_queue.empty())
    {
        clean_VM(V, H, m);
        MyTimePoint startTimePoint = time_point_cast<MyTimePoint::duration>(system_clock::time_point(system_clock::now()));
        Task t = req_queue.front();
        tTask[t] = startTimePoint;
        for (auto r : t.get_resources())
            tTask[t] += seconds(r); // time mapping assigned by us
        vector<double> w(p);
        vector<pair<double, int>> score(N);
        double totsumo = 0;
        for (int i = 0; i < p; i++)
        {
            if (V.empty())
                w[i] = 1 / double(p); // research paper wrong here. -> summation w[i] = 1 should always hold.
            else
            {
                double sumoj = 0;
                for (int j = 0; j < m; j++)
                {
                    vector<int> o = V[j].getO();
                    sumoj += o[i];
                }
                totsumo += sumoj;
                w[i] = sumoj;
            }
        }
        if (!V.empty())
        {
            for (int i = 0; i < p; i++)
                w[i] /= totsumo;
        }
        for (int j = 0; j < N; j++)
        {
            score[j].first = 0;
            score[j].second = j;
            for (int i = 0; i < p; i++)
            {
                vector<double> u = H[j].getU();
                score[j].first += w[i] * (1 - u[i]);
            }
        }
        if (req_queue.size() == 1)
        {
            sort(score.begin(), score.end(), greater<pair<double, int>>());
            int host = score[0].second + 1;
            VM newVM = VM(host);
            newVM.setO(t.get_resources());
            H[host - 1].addVM(newVM);
            H[host - 1].updateU(newVM, true);
            m++;
            V.push_back(newVM);
            cout << "Host: " << host << "\n";
        }
        else
        {
            int host = roulette_wheel(score);
            VM newVM = VM(host);
            newVM.setO(t.get_resources());
            H[host - 1].addVM(newVM);
            H[host - 1].updateU(newVM, true);
            m++;
            V.push_back(newVM);
            cout << "Host: " << host << "\n";
        }
        req_queue.pop();
    }
}