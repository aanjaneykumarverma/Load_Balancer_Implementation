di={"name":"kaushal"}
st1=str(di)

print(st1)
dict1=eval(st1)
print(dict1["name"])
import socket
hostname = socket.gethostname()
IPAddr = socket.gethostbyname(hostname)
print(IPAddr)