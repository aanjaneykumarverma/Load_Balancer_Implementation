import pika
import os
import socket
hostname = socket.gethostname()
IPAddr = socket.gethostbyname(hostname)

# Access the CLODUAMQP_URL environment variable and parse it (fallback to localhost)
url = os.environ.get('amqps://yymrssjo:LlMVqA-WoqZPQjN7co2LeEQEkjmJyHOV@puffin.rmq2.cloudamqp.com/yymrssjo',
                     'amqp://guest:guest@localhost:5672/%2f')
params = pika.URLParameters(url)
connection = pika.BlockingConnection(params)
queue_names = ['hello', "hello2"]
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
