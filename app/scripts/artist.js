// artist module
// compute and hold artist stats

journey.artist = (function() {
    var artistInfo = [];

    var computeArtistStats = function(tracks) {
        tracks.forEach(function(track) {
            var artistName = track.artist['#text'];
            if(!artistInfo.hasOwnProperty(artistName)) {
                artistInfo[artistName] = {
                    'albums': [],
                    'topTracks': []
                };
            }

            var albumExists = false;
            artistInfo[artistName].albums.forEach(function(album){
                if(album.name === track.album['#text']) {
                    albumExists = true;
                    album.count ++;
                }
            });

            if(!albumExists) {
                artistInfo[artistName].albums.push({
                    'name': track.album['#text'],
                    'image': track.image[track.image.length - 1]['#text'],
                    'count': 1
                });
            }

            var trackExists = false;
            artistInfo[artistName].topTracks.forEach(function(topTrack) {
                if(topTrack.name === track.name && topTrack.album === track.album['#text']) {
                    trackExists = true;
                    topTrack.count ++;
                }
            });

            if(!trackExists) {
                artistInfo[artistName].topTracks.push({
                    'name': track.name,
                    'album': track.album['#text'],
                    'count': 1
                });
            }
        });
    };

    var getArtistInfo = function(artistName) {
        if(artistInfo.hasOwnProperty(artistName)) {
            return artistInfo[artistName];
        }

        return null;
    };

    var printAllStats = function() {
        console.log(artistInfo);
    };

    return {
        computeArtistStats: computeArtistStats,
        getArtistInfo: getArtistInfo,
        printAllStats: printAllStats
    };
})();

