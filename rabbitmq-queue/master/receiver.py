import pika, os
import socket
from subprocess import call
import json,ast

url = os.environ.get('amqps://yymrssjo:LlMVqA-WoqZPQjN7co2LeEQEkjmJyHOV@puffin.rmq2.cloudamqp.com/yymrssjo', 'amqp://guest:guest@localhost:5672/%2f')
hostname = socket.gethostname()
IPAddr = socket.gethostbyname(hostname)
params = pika.URLParameters(url)
connection = pika.BlockingConnection(params)
channel = connection.channel() 
channel.queue_declare(queue='hello')
def callback(ch, method, properties, body):
  body1=body.decode()
  request = eval(body1)

  if request["IP"]==str(IPAddr):
    request=request["type"]
    vm_name=request["vm_name"]
    os.environ['vm_info'] = vm_name
    match request:
      case "create_vm":
        rc = call("./vm_creation.sh")
      case "run_task":
        rc=call("./task_driver.sh")

  print(" [x] Received " + str(body))

channel.basic_consume('hello',
                      callback,
                      auto_ack=True)
channel.start_consuming()