//This controls all the routing of the application.

app = require('../web');

app.get("/", function(req, res){
   res.sendfile( __dirname + '../public/index.html' );
   console.log("page loaded");
    req.on('end', function(){
        callback(data);
    });
});

app.get("/api/sms", function(req, res){
    var body = req.query['Body'];
    var number = req.query['From'];
    console.log(body+' '+number);
    sockets.forEach(function(socket){
        socket.emit('sms', {'query' : body, 'number' : number});
    });
    req.on('end', function(){
        callback(data);
    });

});

app.get("/api/notify-new/", function(req, res){
    var match = req.query['match'];
    var toNumber = req.query['phone_number'];
    var song = req.query['song'];
    var artist = req.query['artist'];
    console.log(toNumber);
    console.log(typeof match);
    var body;
    if(match === "true"){
        body = song +" by "+artist+" has been added to the queue!\n\n#ThanksRdio\n-sent via Twilio"; //song + " by "
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
     return "Success";
});