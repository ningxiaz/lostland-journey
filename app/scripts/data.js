// data module
// responsive for fetching data from other APIs

journey.data = (function() {
    var lastfmBase = 'http://ws.audioscrobbler.com/2.0/';
    var lastfmKey = 'bd286e68d3aa369779ff55dfe15470b6';

    var getLastfmTracks = function(username) {
        console.log('getting ' + username + '\'s tracks!');

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

    var computeArtistDailyCounts = function(tracks) {
        var counts = {};
        tracks.forEach(function(track) {
            var dateObj = new Date(parseInt(track.date.uts) * 1000);
            console.log(track.date['#text']);
            // day string will be something like "2014 3 23" (April 23, 2014) local time
            var dayString = dateObj.getFullYear() + ' ' + dateObj.getMonth() + ' ' + dateObj.getDate();

            if(!counts.hasOwnProperty(dayString)) {
                counts[dayString] = 1;
            }
            else {
                counts[dayString] += 1;
            }
        });

        return counts;
    };

    return {
        getLastfmTracks: getLastfmTracks,
        getLastfmArtistTracks: getLastfmArtistTracks,
        computeArtistDailyCounts: computeArtistDailyCounts
    };
})();

