var express = require('express');
var socketsio = require('socket.io');
//Twilio Credentials
var accountSid = "ACf3169c6f6a2f07026985ca29fc0cf088";
var authToken = "3f9d4f81984a7fc85bca4e2f2114ed0e";
//Require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);
var myNumber = "14803516583";
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
   req.end();
});

app.get("/api/sms", function(req, res){
    var body = req.query['Body'];
    var number = req.query['From'];
    console.log(body+' '+number);
    sockets.forEach(function(socket){
        socket.emit('sms', {'query' : body, 'number' : number});
    });
    req.end();

});

app.get("/api/notify-new/", function(req, res){
    var match = req.query['match'];
    var toNumber = req.query['phone_number'];
    var song = req.query['song'];
    //var artist = req.query['artist'];
    console.log(toNumber);
    console.log(match);
    var body;
    if(match){
        body = song +" by someone has been added!"; //song + " by "
    }
    else{
        body = "Your song was not found. Sorry. Try again.";
    }
    client.messages.create({
        to : toNumber,
        from:"+14803516583",
        body: body,
        }, function(err, message){
            process.stdout.write(message.sid);
        });
    req.end();
});

var io = socketsio.listen(server);

io.sockets.on('connection', function(socket) {
    sockets.push(socket);
    console.log("socket connected");
})
