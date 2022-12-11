# Project Rōdobaransa

This project contains our implentation of a Virtual Machine Mapping Policy based on load balancing in private cloud environment.

The policy uses the resource consumption of the running virtual machine and the self-adaptive weighted approach, which resolves the load balancing conflicts of each independent resource caused by different demand for resources of cloud applications. Meanwhile, it uses probability approach to ease the problem of load crowding in the concurrent users scene.

## Tech Stack

- [C++](https://cplusplus.com/)
- [NodeJS](https://nodejs.org/en/)
- [Python](https://www.python.org/)
- [MongoDB](https://www.mongodb.com/)
- [Bash](https://www.gnu.org/software/bash/)
- [Libvirt](https://libvirt.org/)
- [RabbitMQ](https://www.rabbitmq.com/)

## Run Locally

Clone the project on both client and host

```bash
  git clone https://github.com/Akuver/Load_Balancer_Implementation
```

Go to the project directory

```bash
  cd Load_Balancer_Implementation
```

Install dependencies

```bash
  npm install
```

Start the server for appropriate role

```bash
  npm run start
```

## Authors

- [@Aanjaney Kumar Verma](https://www.github.com/Akuver)
- [@Kaushal Kumar](https://www.github.com/kaushalkuma-r)

## License

[MIT](https://choosealicense.com/licenses/mit/)
