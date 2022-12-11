import pika
import os
import socket
import sys
hostname = socket.gethostname()
IPAddr = socket.gethostbyname(hostname)

# Access the CLODUAMQP_URL environment variable and parse it (fallback to localhost)
url = "amqps://szvohhtx:88eua6-Vh6JHx1aEhzIStXoq-oil8GmW@puffin.rmq2.cloudamqp.com/szvohhtx"
params = pika.URLParameters(url)
connection = pika.BlockingConnection(params)
queue_names = ['hello', "hello2"]
requests = []
file_name=sys.argv[1]
with open(file_name) as f:
    lines = f.readlines()
        
# dict1 = {"IP": str(IPAddr), "type": "create_vm", "vm_name": "ka"}
st1 = str(lines)
print(st1)
# while True:
for i in queue_names:
    channel = connection.channel()
    # start a channel
    channel.queue_declare(queue=i)  # Declare a queue
    channel.basic_publish(exchange='',
                          routing_key=i,
                          body=st1)


print(" [x] Sent 'Hello World!'")
# connection.close()
