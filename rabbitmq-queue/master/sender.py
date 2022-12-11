import pika
import os
import socket
# Access the CLODUAMQP_URL environment variable and parse it (fallback to localhost)
url = "amqps://szvohhtx:88eua6-Vh6JHx1aEhzIStXoq-oil8GmW@puffin.rmq2.cloudamqp.com/szvohhtx"


params = pika.URLParameters(url)
connection = pika.BlockingConnection(params)

with open("{0}".format(os.path.abspath("ip.txt"))) as f:
    lines = f.readlines()
queue_names = []
for line in lines:
    queue_names.append(str(line))
 # ip of hosts
with open("runCommands.txt") as f:
    commands = f.readlines()
requests = []
for command in commands:
    task = {}
    command = command.split()
    task["IP"] = str(command[0])
    task["type"] = str(command[1])
    task["vm_name"] = str(command[2])
    requests.append(task)
for dict1 in requests:
    st1 = str(dict1)
    print(st1)
    # while True:
    for i in queue_names:
        print(i)
        channel = connection.channel()
        # start a channel
        channel.queue_declare(queue=i)  # Declare a queue
        channel.basic_publish(exchange='',
                              routing_key=i,
                              body=st1)


print(" [x] Sent 'Hello World!'")
# connection.close()
# IP create_vm/task_run/vm_info vm1
