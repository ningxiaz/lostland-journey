// artist module
// compute and hold artist stats

journey.artist = (function() {
    var artistInfo = {};
    var tracksInfo = {};

    var computeArtistStats = function(tracks) {
        tracks.forEach(function(track) {
            var artistName = track.artist['#text'];
            if(!artistInfo.hasOwnProperty(artistName)) {
                artistInfo[artistName] = {
                    'albums': [],
                    'topTracks': [],
                    'total': 1
                };
            }
            else {
                artistInfo[artistName].total ++;
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

            // save global tracks info too
            var trackString = track.name + ' - ' + track.album['#text'];
            if(!tracksInfo.hasOwnProperty(trackString)) {
                tracksInfo[trackString] = {
                    'name': track.name,
                    'album': track.album['#text'],
                    'artist': track.artist['#text'],
                    'count': 1
                };
            }
            else {
                tracksInfo[trackString].count ++;
            }
        });

        // sort the tracks
        for (var artistName in artistInfo) {
            if(artistInfo.hasOwnProperty(artistName)) {
                artistInfo[artistName].topTracks.sort(function(a, b) {
                    if(a.count > b.count) return -1;
                    if(a.count < b.count) return 1;
                    return 0;
                });
            }
        }
    };

    var getArtistInfo = function(artistName) {
        if(artistInfo.hasOwnProperty(artistName)) {
            return artistInfo[artistName];
        }

        return null;
    };

    var getAllArtistInfo = function() {
        return artistInfo;
    };

    var getAllTracksInfo = function() {
        return tracksInfo;
    };

    var printAllStats = function() {
        console.log(artistInfo);
    };

    var clearAllStats = function() {
        artistInfo = {};
        tracksInfo = {};
    };

    return {
        computeArtistStats: computeArtistStats,
        getArtistInfo: getArtistInfo,
        printAllStats: printAllStats,
        clearAllStats: clearAllStats,
        getAllArtistInfo: getAllArtistInfo,
        getAllTracksInfo: getAllTracksInfo
    };
})();

