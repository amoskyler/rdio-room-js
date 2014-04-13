// web.js
var express = require('express');
var logfmt = require('logfmt');
var fs = require('fs');
var socketsio = require('socket.io');
var rdio = require('rdio');
var app = express();
var sockets = [];

app.use(logfmt.requestLogger());
app.use(express.static( __dirname  + '/public' ));

app.get('/api/sms', function(req, res) {
    var body = req.query["Body"]
    console.log(body);
    // your business logic here
    if(typeof(body) !== "undefined"){
        sockets.forEach(function( socket ){
        socket.emit('query', body);
    });
}
});

app.get('/index.html', function( req, res ){
    //res.sendfile( __dirname + '/index.html' );
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});

var io = require('socket.io').listen( 3030 );

io.sockets.on('connection', function (socket) {
  sockets.push( socket );
});
