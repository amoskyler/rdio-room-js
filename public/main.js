R.ready(function(){
    R.authenticate(function(){
        playSong('t2910908');
    });
});

function addSongToEndOfQueue(querystring, phone_number) {
// takes a string and makes an api query to get the closet-matching track
    R.request({
        method: "search",
        content: {
            query: querystring,
            types: ["Track",],
            count: 1
        },
        success: function(response) {
            var match;
            if (response.result.number_results > 0) {
                match = true;
                var song = response.result.results[0];
                R.player.queue.add(song.key);
                console.log("queued: " + song.name);
            } else {
                match = false;
                console.log("no results");
            }
            var song_name;
            if (typeof song === 'undefined') {
                song_name = "";
            } else {
                song_name = song.name;
            }
            notifyNewQueued(match, phone_number, song_name);
        },
        error: function(response) {
            console.log("error: " + response.message);
        }
    });
}

function playSong(id) {
// immediately start playing song with the given id
    R.player.play({source: id});
}

function notifyNewQueued(match, phone_number, song_name) {
// notify a user of a newely queued song. 'song' should be an rdio song object.
// TODO: also notify of queue position and/or duration until play
    ajaxGet({
        match: match,
        phone_number: phone_number,
        song: song_name},
        '/api/notify-new/',
        function(response){ console.log(response); }
    );
}


/* utility functions */

function ajaxGet(params, endpoint, callback_success) {
    $.ajax({
        type: "GET",
        url: endpoint,
        data: params,
        crossDomain: true,
        success: callback_success,
        error: function(xhr, textStatus, errorThrown) {
            if (xhr.status != 0)
                console.error('Oh no! Something went wrong. Please report this error: \n'+errorThrown+xhr.status+xhr.responseText);
        }
    });
}

