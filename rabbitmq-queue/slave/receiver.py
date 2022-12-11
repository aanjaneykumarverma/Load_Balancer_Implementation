import pika
import os
import socket
from subprocess import call
import json
import ast

url ="amqps://szvohhtx:88eua6-Vh6JHx1aEhzIStXoq-oil8GmW@puffin.rmq2.cloudamqp.com/szvohhtx"
hostname = socket.gethostname()
IPAddr = socket.gethostbyname(hostname)
params = pika.URLParameters(url)
connection = pika.BlockingConnection(params)
channel = connection.channel()
channel.queue_declare(queue='hello')


def callback(ch, method, properties, body):
    body1 = body.decode()
    request = eval(body1)

    if request["IP"] == str(IPAddr):
        request = request["type"]
        vm_name = request["vm_name"]
        os.environ['vm_name'] = vm_name
        match request:
            case "create_vm":
                rc = call("./vm_creation.sh")
            case "run_task":
                rc = call("./task_driver.sh")
            case "getInfo":
                rc = call("./vmInfo.sh")
            case "resultsCheck":
                rc=call(['python3', 'taskResult.py'])
    print(" [x] Received " + str(body))


channel.basic_consume('hello',
                      callback,
                      auto_ack=True)
channel.start_consuming()
