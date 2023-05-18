# Project Rōdobaransa
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

This project contains our implentation of a Virtual Machine Mapping Policy based on load balancing in private cloud environment.

The policy uses the resource consumption of the running virtual machine and the self-adaptive weighted approach, which resolves the load balancing conflicts of each independent resource caused by different demand for resources of cloud applications. Meanwhile, it uses a probabilistic approach to ease the problem of load crowding in the concurrent users scene.
## Installation
- Client Node
```
1. Download an ISO File for Ubuntu. 
2. Download virt-manager on all client nodes.
3. Clone VMs using the ISO File obtained in step 1.
4. Step 3 has to be done by using vm_creation.sh script present in the scripts folder under clientNode.
5. Enable qemu-guest-agent on all VMs.
6. Add test programs in all VMs and convert them into executable binaries.
```
    
## Run Locally

Clone the project on all client nodes and master node.

```bash
  git clone https://github.com/Akuver/Load_Balancer_Implementation.git
```

Go to the project directory clientNode and masterNode when setting up for Client Node and Master Node respectively.

```bash
  cd Load_Balancer_Implementation/Integration/clientNode
  cd Load_Balancer_Implementation/Integration/masterNode
```

Install dependencies

```bash
  npm install
```

Start the client servers first and only then the master server.

```bash
  npm run start
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

- Client Node

    `DB -  YOUR_MONGODB_PATH_HERE` 

    `IP - IP_ADDRESS_OF_YOUR_MACHINE_HERE`

    `PORT - PORT_ON_WHICH_THE_SERVER_RUNS_HERE`

    `ISOPATH - ISO_FILE_PATH_FOR_UBUNTU_HERE`

- Master Node

    `DB -  YOUR_MONGODB_PATH_HERE` 

    `PORT - PORT_ON_WHICH_THE_SERVER_RUNS_HERE`

## Authors

- [@Aanjaney Kumar Verma](https://www.github.com/Akuver)
- [@Kaushal Kumar](https://www.github.com/kaushalkuma-r)
## License

[MIT](https://choosealicense.com/licenses/mit/)


![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png)

