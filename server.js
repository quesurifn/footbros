var app, compression, express, io, products, server, socketHandler;

express = require('express');

compression = require('compression');

products = require('./server/products');

app = express();

server = require('http').Server(app);

io = require('socket.io')(server);

socketHandler = require('./lib/socketHandler');

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
