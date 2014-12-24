// data module
// responsive for fetching data from other APIs

journey.data = (function() {
    var lastfmBase = 'http://ws.audioscrobbler.com/2.0/';
    var lastfmKey = 'bd286e68d3aa369779ff55dfe15470b6';

    var getLastfmTracks = function(username) {
        $.ajax({
            url: lastfmBase + '?method=user.getrecenttracks&user=' + username + '&api_key=' + lastfmKey + '&format=json',
            success: function(data) {
                if (data.error) {
                    console.log('ERROR [data.getLastfmTracks]:' + data.message);
                }
                else {
                    console.log(data);
                }
            }
        });
        console.log('getting ' + username + '\'s tracks!');
    };

    return {
        getLastfmTracks: getLastfmTracks
    };
})();

