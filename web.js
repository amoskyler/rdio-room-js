var express = require('express');
var socketsio = require('socket.io');
//Twilio Credentials
var accountSid = "ACf3169c6f6a2f07026985ca29fc0cf088";
var authToken = "3f9d4f81984a7fc85bca4e2f2114ed0e";
//Require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);
var myNumber = "14803516583";
var app = module.exports = express();
var server = require ('http').createServer(app);
app.use(express.static( __dirname  + '/public' ));
var sockets = [];

var port = Number(process.env.PORT || 5000);
server.listen(port, function() {
    console.log("Listening on " + port);
});

require('./routes');

var io = socketsio.listen(server);

io.sockets.on('connection', function(socket) {
    sockets.push(socket);
    console.log("socket connected");
})
