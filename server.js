/*
var app, compression, express, io, products, server, socketHandler;

express = require('express');

compression = require('compression');

products = require('./server/products');

app = express();

server = require('http').Server(app);

io = require('socket.io')(server);

socketHandler = require('socketHandler');

server.listen(process.env.PORT || 5000);

app.use('/', express["static"](__dirname + '/www'));

app.use(compression());

app.get('/products', products.findAll);

app.get('/products/:id', products.findById);

app.get('/config.json', function(request, response) {
  return response.json({
    socketUrl: "http://localhost:5000/socket.io"
  });
});

io.on('connection', socketHandler);

*/

var express = require('express');
var app = express();

compression = require('compression');

products = require('./server/products');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

app.use(compression());

app.use('/', express["static"](__dirname + '/www'));

app.get('/products', products.findAll);

app.get('/products/:id', products.findById);

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
