// lastfm module
// interfacing with Last.fm API: http://www.last.fm/api/intro

journey.lastfm = (function() {
    var lastfmBase = 'http://ws.audioscrobbler.com/2.0/';
    var lastfmKey = 'bd286e68d3aa369779ff55dfe15470b6';

    // from, to are both Date objects
    var getLastfmTracks = function(username, from, to, callback) {
        console.log('getting ' + username + '\'s tracks!');

        var fromParam = from.getTime() / 1000;
        var toParam = to.getTime() / 1000;

        var allData = [];

        // a recursive helper function to get all pages of data
        function recentTracks (currentPage, totalPages) {
            if(currentPage === totalPages) {
                console.log(allData);
                if(callback) {
                    callback(allData);
                }
                return;
            }

            currentPage ++;

            $.ajax({
                url: lastfmBase + '?method=user.getrecenttracks&user=' + username + '&api_key=' + lastfmKey + '&limit=200&format=json&from=' + fromParam + '&to=' + toParam + '&page=' + currentPage,
                success: function(data) {
                    if (data.error) {
                        console.log('ERROR [data.getLastfmTracks]:' + data.message);
                    }
                    else {
                        var total = parseInt(data.recenttracks['@attr'].totalPages);
                        var current = parseInt(data.recenttracks['@attr'].page);
                        console.log('Current Page: ' + current);
                        console.log('Total Page: ' + total);
                        allData = allData.concat(data.recenttracks.track);
                        recentTracks(current, total);
                    }
                }
            });

        }

        // trigger the recursive function to get data
        recentTracks(0, null);
    };

    var getLastfmArtistTracks = function(username, artist, callback) {
        console.log('getting ' + username + '\'s tracks by ' + artist + '!');

        $.ajax({
            url: lastfmBase + '?method=user.getArtistTracks&user=' + username + '&artist=' + artist + '&api_key=' + lastfmKey + '&format=json',
            success: function(data) {
                if (data.error) {
                    console.log('ERROR [data.getLastfmArtistTracks]:' + data.message);
                }
                else {
                    console.log(data);
                    if(callback) {
                        callback(data);
                    }
                }
            }
        });
    };

    

    return {
        getLastfmTracks: getLastfmTracks,
        getLastfmArtistTracks: getLastfmArtistTracks
    };
})();

