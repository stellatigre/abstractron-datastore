var express = require('express'),
    users = require('./routes/users'),
	images = require('./routes/images'),
	levels = require('./routes/levels');

var app = express();

app.configure(function () {
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
});

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

// Start
app.listen(3002);
console.log('API: INIT [OK]');
