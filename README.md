abstractapi-node
================
## Abstractron MongoDB/ExpressJS Cloud Manager

### Tests

1) Modify tests/lib/testConfig.json to point to your development API instance:

    {
        "baseUrl" : "http://yourhost:3002"
    }

2) Install additional required modules via npm (CM note: going by what I saw on fresh install, these might want to move to the dependencies in package.json):

    mocha
    chai
    async
    request

3) Run tests via npm...

    npm test
    
4) ...or mocha directly.

    mocha -R <desired_reporter_name> tests/*.js

5) Enjoy!
