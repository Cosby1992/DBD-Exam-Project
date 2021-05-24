
# DBD Exam Project
This project is made for an exam in databases.


## Databases
1. MongoDB
2. Neo4j
3. Redis

## System Architecture
Microservice architecture using docker and REST API. 

Each database will run in it's own container along with an API with methods to 
use the specific database.

A server will handle client connections and work as an API for entire system. 
This makes it easy to connect front-end work to the systems and make sure it is 
easy to make changes to individual systems. 

## Data persistence location
### MongoDB
1. Profile data (authencation)
2. Possibly log data

### Neo4j 
1. Statistical user data such as age, gender etc.
2. Relations between users, like friend, mother, son 

### Redis
1. Messages between users
2. Possibly Autherization with jwt-tokens


## Argument for use of these database systems
### MongoDB
1. 
2. 

### Neo4j 
Using neo4j to store user to user relations as well as statistical data will allow
us to take advantage of neo4j's graph struckture. It will become very easy to recommend 
new friends ie: we could query the db searching for friends of the users friends +- 5 years 
his own age. 
Another example; if three of the users friends is friends with a user which the user is not 
firends with. This could be a possible new friend for the user. And queries like theese are 
Neo4j's stregnths. It is both fast to find these interconnections as well as easy to visualize 
using a graph database. 

### Redis
Fast in memory storage makes this database perfect for handling lots of request. 
Therefore this database is used for messages between the users as well as maybe 
autherization using the JWT tokens. 