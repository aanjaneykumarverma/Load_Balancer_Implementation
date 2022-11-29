import pika, os
import socket
from subprocess import call

url = os.environ.get('amqps://yymrssjo:LlMVqA-WoqZPQjN7co2LeEQEkjmJyHOV@puffin.rmq2.cloudamqp.com/yymrssjo', 'amqp://guest:guest@localhost:5672/%2f')
hostname = socket.gethostname()
IPAddr = socket.gethostbyname(hostname)
params = pika.URLParameters(url)
connection = pika.BlockingConnection(params)
channel = connection.channel() 
channel.queue_declare(queue='QUEUENAME')
def callback(ch, method, properties, body):
  if body["ip"]==str(IPAddr):
    request=body["request"]
    match request:
      case "create_vm":
        rc = call("./vm_creation.sh")
      case "run_task":
        rc=call("./task_driver.sh")

  print(" [x] Received " + str(body))

channel.basic_consume('hello',
                      callback,
                      auto_ack=True)

# print(' [*] Waiting for messages:')
channel.start_consuming()
# connection.close()