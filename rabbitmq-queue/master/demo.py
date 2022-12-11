with open("runCommands.txt") as f:
    commands=f.readlines()
requests=[]
for command in commands:
    task={}
    command=command.split()
    task["IP"]=str(command[0])
    task["type"]=str(command[1])
    task["vm_name"]=str(command[2])
    requests.append(task)
    print(command)
print(requests)