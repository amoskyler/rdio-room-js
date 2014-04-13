// web.js
var express = require('express');
var logfmt = require('logfmt');
var socketio = require('socket.io');
var rdio = require('rdio');
var app = express();

app.use(logfmt.requestLogger());

app.get('/api/sms', function(req, res) {
    console.log(req);
    var body = req.query["Body"]
  console.log(body);
  // your business logic here
  if(typeof(body) !== "undefined"){
        res.send('<Response><Message>'+body+'</Message></Response>');
    }
});

app.get('/', function(req, res){

});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
