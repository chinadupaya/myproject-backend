var socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};

socketApi.io = io;

io.on('connection', function(socket){
    console.log('A user connected');
    socket.emit('test event','here is some data');
});

socketApi.sendNotification = function() {
    io.sockets.emit('test event', {msg: 'Hello World!'});
}

module.exports = socketApi;