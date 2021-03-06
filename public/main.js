var socket = io.connect("http://rdio-room-js.herokuapp.com/");
socket.on('sms', function(data) {
    query = data.query;
    number = data.number
    addSongToEndOfQueue(query, number, true);
    console.log(query);
})

$(document).ready(function(){
    $('#tags').keypress(function(event){
        if (event.which === 13 && $(this).length > 0)
            addSongToEndOfQueue($(this).val(), '', false);
    });
});

R.ready(function(){
    R.authenticate(function(){
        //playSong('t2910908');
    });
    $('#button-play').click(function(){
        R.player.togglePause();
    });
    $('#button-next').click(function(){
        nextSong();
    });
    $(document).keypress(function(event){
        if (event.which === 39)
            nextSong();
    });
});

function nextSong() {
    R.player.next();
    var top_item = "#song-list li:first";
    $(top_item).remove();
    $(top_item).addClass('active');
    $('#current-track h1').text($(top_item).attr('data-title'));
    $('#current-track h2').text($(top_item).attr('data-artist'));
    $('.bg').addClass('to-be-deleted');
    var $background = $('<img/>', {
        src: $(top_item).attr('data-art'),
        style: 'display: none',
        'class': 'bg'
    }).prependTo('body').fadeIn('slow',
        function(){ $('.to-be-deleted').remove() });
}

function addSongToEndOfQueue(querystring, phone_number, notify) {
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
                addTrackToDOM(song);
                console.log("queued: " + song.name);
            } else {
                match = false;
                console.log("no results");
            }
            if (notify)
                notifyNewQueued(match, phone_number, song);
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

function notifyNewQueued(match, phone_number, song) {
// notify a user of a newely queued song. 'song' should be an rdio song object.
// TODO: also notify of queue position and/or duration until play
    if(typeof song.name === 'undefined') {
        song.name = song.artist = '';
    }

    ajaxGet({
        match: match,
        phone_number: phone_number,
        song: song.name,
        artist: song.artist},
        '/api/notify-new/',
        function(response){ console.log(response) }
    );
}

function addTrackToDOM(song) {
    var $li = $('<li/>', {
        style: 'display:none'
    }).appendTo('#song-list ul');

    $li.attr('data-title', song.name)
       .attr('data-artist', song.artist)
       .attr('data-art',
             song.icon400.substring(0, song.icon400.length - 7)+'1200.jpg');

    var $a = $('<a/>', {
        href: '#'
    }).appendTo($li);

    var $i1 = $('<i/>', {
        'class': 'fa fa-volume-up fa-2x'
    }).appendTo($a);

    var $span1 = $('<span/>', {
        'class': 'title',
        'text': song.name
    }).appendTo($a);

    var $span2 = $('<span/>', {
        'class': 'artist',
        'text': song.artist
    }).appendTo($a);

    var $div = $('<div/>', {
        'style': 'float:right;valign:top;'
    }).appendTo($a);

    var $i2 = $('<i/>', {
        'class': 'fa fa-trash-o fa-2x'
    }).appendTo($div);
    $li.slideDown();
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

