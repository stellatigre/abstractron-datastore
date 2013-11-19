var express = require('express'),
    users = require('./routes/users'),
	images = require('./routes/images'),
	levels = require('./routes/levels'),
	blocks = require('./routes/blocks');

var app = express();

app.configure(function () {
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
});

app.get('/users/login/:username', users.findUsername);
app.get('/users', users.findAll);
app.get('/users/:id', users.findById);
app.post('/users', users.addUser);
app.put('/users/:id', users.updateUser);
app.delete('/users/:id', users.deleteUser);

app.get('/images', images.findAll);
app.get('/images/:id', images.findById);
app.post('/images', images.addImage);
app.put('/images/:id', images.updateImage);
app.delete('/images/:id', images.deleteImage);

app.get('/levels', levels.findAll);
app.get('/levels/:id', levels.findById);
app.post('/levels', levels.addLevel);
app.put('/levels/:id', levels.updateLevel);
app.delete('/levels/:id', levels.deleteLevel);

app.get('/user/:id/blocks', blocks.findByUserId);
app.get('/blocks', blocks.findAll);
app.get('/blocks/:id', blocks.findById);
app.post('/blocks', blocks.addBlock);
app.put('/blocks/:id', blocks.updateBlock);
app.delete('/blocks/:id', blocks.deleteBlock);

// Start
app.listen(3002);
console.log('API: INIT [OK]');
