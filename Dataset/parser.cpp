
#include <bits/stdc++.h>
using namespace std; 
int main()
{
    string fname;
    cout<<"Enter the file name: ";
    cin>>fname;
    
    vector<string> memory;
    vector<string> cpu;
    vector<string> row;
    string line, word;
    
    fstream file (fname, ios::in);
    if(file.is_open()){
        while(getline(file, line)){
            stringstream str(line);
            int i=0;
            while(getline(str, word, ',') ){
                if(i==1){
                    cpu.push_back(word);
                }
                else if(i==2) memory.push_back(word);
                i++;
            }
            
        }
    }
    else cout<<"Could not open the file\n";
    // cout << "CPU"<<endl;
    for(int i=0;i<cpu.size();i++){
        
        cout<<cpu[i]<<" ";
    }
     cout <<endl;
    for(int j=0;j<memory.size();j++){
            cout<<memory[j]<<" ";
    }
    
    return 0;
}
 