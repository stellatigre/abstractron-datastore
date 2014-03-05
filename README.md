# Abstractron MongoDB/ExpressJS Butt Manager (abstractapi-node)

## Purpose

The Abstractron Butt Manager is a Node.JS based backend API for use in Abstractron research and within released products. It serves as a repository for initial data stores to support Quantized cloud functionality:

* New user registration and authentication, via web and also in-game.
** Future-proof authentication against external authorities with passport
* Block, level, image, video URL storage.

## Prerequisites
* Node.JS (0.10.x required, latest stable release of 0.10 recommended)
* Mongodb (2.2+ - latest stable recommended)

## Data Store Setup

1) Follow instructions at http://docs.mongodb.org/manual/installation for your desired platform to install a mongodb instance for the API to bind to.

2) When mongodb has finished installing, you start the daemon on default port 27017 like so:

    mongod --dbpath ./data
    
3) Open a new console once mongod is finished booting, and type 'mongo' to access the command line mongodb client. Type 'use abstractapi' to create a new database entry for the API data store. The database is not permanently created until the application first runs and inserts test data into the collection.

    MongoDB shell version: n.n.n
    connecting to: test
    Welcome to the MongoDB shell.
    ...
    ...
    > use abstractapi
    switched to db abstractapi
    > show databases
    abstractapi (empty)
    local   0.078125GB

## Application Setup

1) Clone this repo locally.

    git clone https://github.com/abstractron/abstractapi-node.git .
    
2) Perform an npm install using --dev switch to also retrieve test-related modules. Failure to use the --dev switch will prevent test-related modules from being installed (see below).

    npm install --dev
    
3) Start the application via node or forever

    node app *OR* forever app.js
    
    API: INIT [OK]
    users: Connection opened.
    images: Connection opened (images).
    videos: Connection opened (videos).
    levels: Connection opened (users, levels).
    users: Connection opened (blocks).
    login: Connection opened (users).
    register: Connection opened (users).
    Users collection does not exist, creating from sample data.
    Images collection does not exist, creating from sample data.
    Videos collection does not exist, creating from sample data.
    Levels collection does not exist, creating from sample data.
    Levels collection does not exist, creating from sample data.
    Blocks collection does not exist, creating from sample data.
    MongoStore session db connection OK.
    
4) If you see the output above, test datasets have been inserted successfully to mongodb. the app should now monitor the configured port (3002 by default) for API requests.
    
## Testing with Mocha

NOTE: The following modules are dev-only dependencies related to the test platform, which will not be installed unless the --dev flag is used on npm install.

    mocha
    chai
    async
    request
    
3) Modify tests/lib/testConfig.json to point to your development API instance:

    {
        "baseUrl" : "http://yourhost:3002"
    }

1) Run tests from the root directory via npm...

    npm test
    
2) ...or mocha directly.

    mocha -R <desired_reporter_name> tests/*.js

3) Enjoy!  Look at the sample data included to know what objects each route expects.
