from datetime import datetime
import random

def loadGenerator(load):
    loads=["low","medium","high"]
    size=100
    load_size= random.randint(0.4*size,0.6*size)
    res={}
    if load=="low":
        res["low"]=load_size
        res["medium"]=random.randint(0.2*size,0.4*size)
        res["high"]=size-load_size-res["medium"]
    if load=="medium":
        res["medium"]=load_size
        res["low"]=random.randint(0.2*size,0.4*size)
        res["high"]=size-load_size-res["low"]
    if load=="high":
        res["high"]=load_size
        res["medium"]=random.randint(0.2*size,0.4*size)
        res["low"]=size-load_size-res["medium"]
    if load=="random":
        a = random.randint(1, 98)
        b = random.randint(1, 98 - a)
        c = 100 - a - b
        random.shuffle(loads)
        res[loads[0]]=a
        res[loads[1]]=b
        res[loads[2]]=c
    return res

if __name__=="__main__":
    
    res=loadGenerator("low")
    print("low",res,res["low"]+res["high"]+res["medium"])
    load_list=[]
    for key in res.keys():
        load_list+=[key]*res[key]
    
    with open('load.txt', 'w') as f:
        for load in load_list:
            f.write(load)
            f.write('\n')

        

