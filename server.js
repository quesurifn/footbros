var express = require('express'),
    //path = require('path'),
    compression = require('compression'),
    products = require('./server/products'),
    server = require('http'),
    io = require('./server/socket.io/lib/index'),
    app = express();

    var io = io.listen(server);

app.set('port', process.env.PORT || 5000);

app.use(compression());
app.use('/', express.static(__dirname + '/www'));

app.get('/products', products.findAll);
app.get('/products/:id', products.findById);

app.listen(app.get('port'), function (socket) {
	io.on('connection', function(socket){
	    socket.on('event:new:image',function(data){
	        socket.broadcast.emit('event:incoming:image',data);
	    });
	});
    console.log('Express server listening on port ' + app.get('port'));
    console.log('Socket.io Running');

});

