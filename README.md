# Chat system API
This API is developped for a Database Exam. It is an implementation of Polyglot persistence. 
The API is based on the social media platforms that are know today, with Facebook as primary inspiration. 
The API includes methods to create and handle users, friends realtaions and recommendations as well as messages. 

# Install Guide

## Prerequisites
To run this system, it is required that you have docker and nodeJS installed. 

# To run
1. Clone this repository
2. Navigate in CLI to /mongodb_api and run ```docker-compose up -d --build```
3. Navigate in CLI to /neo4j_api and run ```docker-compose up -d --build```
4. Navigate in CLI to /redis_api and run ```docker-compose up -d --build```
5. Navigate in CLI to /chat_api and run ```npm install && npm start```

The ```-d``` in the docker command tells docker to detatch from the current CLI. If you want to monitor the start-up and log's during runtime, you should connect to the docker container, open the docker container in docker desktop or run the command without the ```-d``` flag.

The API is now running on http://localhost:3000. If you send a GET request to the root domain, you sould get a response with ```{ message: "OK" }``` in the body. This indicates that the API is running OK. 

OBS: The systems will take some time to start up, especially neo4j, since it has to install external libraries before accepting connections. All the containers download dependencies before accepting connections. Therefore, make sure that all the containers are ready to accept connection before testing the API.

# To test
Every endpoint in the API is documented in the API_DOC.md file in the root folder. 
To test all endpoints you need to be able to send both GET and POST requests, either from a server/client or a developper-support tool such as Postman, Insomnia, curl or other online platforms.

