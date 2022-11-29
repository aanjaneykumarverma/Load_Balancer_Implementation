import pika, os

# Access the CLODUAMQP_URL environment variable and parse it (fallback to localhost)
url = os.environ.get('amqps://yymrssjo:LlMVqA-WoqZPQjN7co2LeEQEkjmJyHOV@puffin.rmq2.cloudamqp.com/yymrssjo', 'amqp://guest:guest@localhost:5672/%2f')
params = pika.URLParameters(url)
connection = pika.BlockingConnection(params)
queue_names=['hello',"hello2"]
# while True:
for i in queue_names:
    channel = connection.channel()
    # start a channel
    channel.queue_declare(queue=i) # Declare a queue
    channel.basic_publish(exchange='',
                            routing_key=i,
                        body='Cloud Computing BTP')


print(" [x] Sent 'Hello World!'")
# connection.close()