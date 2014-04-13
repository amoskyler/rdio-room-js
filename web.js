//web.js
var express = require('express');
//var logfmt = require('logfmt');
//var fs = require('fs');
var socketsio = require('socket.io');
//var rdio = require('rdio');



var app = express();
var server = require ('http').createServer(app);

var sockets = [];

var port = Number(process.env.PORT || 5000);
server.listen(port, function() {
    console.log("Listening on " + port);
});

app.get("/", function(req, res){
   res.sendfile( __dirname + '/public/index.html' );
   console.log("page loaded");
});

app.get("/api/sms", function(req, res){
    var body = req.query['Body'];
    sockets.forEach(function(socket){
        socket.emit('query', {'query' : body});
    });
});

var io = socketsio.listen(server);

io.sockets.on('connection', function(socket) {
    socket.emit('test', { hello: 'world' });
    sockets.push(socket);
    console.log("socket connected");
})










/*
app.use(logfmt.requestLogger());
app.use(express.static( __dirname  + '/public' ));

app.get('/api/sms', function(req, res) {
    var body = req.query["Body"]
    console.log(body);
    // your business logic here
    if(typeof(body) !== "undefined"){
        sockets.forEach(function( socket ){
        socket.emit('query', body);
        console.log(socket.emit('query', body));
    });
}
});

app.get('/', function( req, res ){
    res.sendfile( __dirname + '/index.html' );
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});

var io = require('socket.io').listen( 3030 );

io.sockets.on('connection', function (socket) {
  sockets.push( socket );
});
*/
