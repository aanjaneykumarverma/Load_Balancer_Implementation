#include <iostream>
#include <vector>
#include <random>
#include <chrono>
#include "Node.h"
#include "VM.h"
#define N 5 // number of nodes
#define M 5 // number of VMs in a node
using namespace std;
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
int main()
{
    /*
     freopen("input.txt", "r", stdin);
     freopen("output.txt", "w", stdout);
     */
    int m = 0;         // total VMs
    int p = 0;         // number of resources
    vector<Node> H(N); // set of running hosts
    vector<VM> V;      // set of running VMs

    p = H[0].getp();

    vector<double> w(p);
    vector<pair<double, int>> score(N);

    for (Node host : H)
    {
        m += host.getVM().size();
        for (VM vm : host.getVM())
        {
            if (vm.is_running())
                V.push_back(vm);
        }
    }
    double totsumo = 0;
    for (int i = 0; i < p; i++)
    {
        if (V.empty())
            w[i] = 1 / double(m);
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
    if (N == 1)
    {
        sort(score.begin(), score.end(), greater<pair<double, int>>());
        cout << "VM: " << score[0].second + 1;
    }
    else
    {
        cout << "VM: " << roulette_wheel(score);
    }
}