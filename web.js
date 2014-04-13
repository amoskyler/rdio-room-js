// web.js
var express = require('express');
var logfmt = require('logfmt');
var socketio = require('socket.io')
var app = express();

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
    console.log(req);
    var body = req.query["Body"]
  console.log(body);
  // your business logic here
  res.send('<Response><Message>'+body+'</Message></Response>');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
