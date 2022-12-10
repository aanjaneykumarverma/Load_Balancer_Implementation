import pika
import os
import socket
from subprocess import call
import json
import ast
url = "amqps://szvohhtx:88eua6-Vh6JHx1aEhzIStXoq-oil8GmW@puffin.rmq2.cloudamqp.com/szvohhtx"
hostname = socket.gethostname()
IPAddr = socket.gethostbyname(hostname)
params = pika.URLParameters(url)
connection = pika.BlockingConnection(params)
channel = connection.channel()
channel.queue_declare(queue='hello')


def callback(ch, method, properties, body):
    body1 = body.decode()
    request = eval(body1)
    # request=str(request)
    print(type(request))
    print(request[0])
    print(type(request[0]))
    dict = eval(request[0])
    print(type(dict))
    
    with open("sample.json", "w") as outfile:
        json.dump(dict, outfile)


    # print(" [x] Received " + str(body))


channel.basic_consume('hello',
                      callback,
                      auto_ack=True)
channel.start_consuming()
