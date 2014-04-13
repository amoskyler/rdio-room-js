var express = require('express');
var socketsio = require('socket.io');


var app = express();
var server = require ('http').createServer(app);
app.use(express.static( __dirname  + '/public' ));
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

app.get("/api/notify-new/", function(req, res){

});

var io = socketsio.listen(server);

io.sockets.on('connection', function(socket) {
    socket.emit('test', { hello: 'world' });
    sockets.push(socket);
    console.log("socket connected");
})
