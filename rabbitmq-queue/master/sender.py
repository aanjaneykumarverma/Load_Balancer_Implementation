import pika
import os
import socket
hostname = socket.gethostname()
IPAddr = socket.gethostbyname(hostname)

# Access the CLODUAMQP_URL environment variable and parse it (fallback to localhost)
url ="amqps://szvohhtx:88eua6-Vh6JHx1aEhzIStXoq-oil8GmW@puffin.rmq2.cloudamqp.com/szvohhtx"
                     
params = pika.URLParameters(url)
connection = pika.BlockingConnection(params)
queue_names = ['hello', "hello2"]  # ip of hosts
requests = []

dict1 = {"IP": str(IPAddr), "type": "create_vm", "vm_name": "ka"}
st1 = str(dict1)
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
# IP create_vm/task_run/vm_info vm1
