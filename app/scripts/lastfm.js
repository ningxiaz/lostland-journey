// lastfm module
// interfacing with Last.fm API: http://www.last.fm/api/intro

journey.lastfm = (function() {
    var lastfmBase = 'http://ws.audioscrobbler.com/2.0/';
    var lastfmKey = 'bd286e68d3aa369779ff55dfe15470b6';

    // from, to are both Date objects
    // now it's recursive, when migrated to Angular, should use promise chains
    var getLastfmTracks = function(username, from, to, callback) {
        console.log('getting ' + username + '\'s tracks!');

        var fromParam = from.getTime() / 1000;
        var toParam = to.getTime() / 1000;

        var allData = [];

        function recentTracks(totalPages) {
            var promises = [];

            for(var i = 1; i <= totalPages; i ++) {
                var promise = $.ajax({
                    url: lastfmBase + '?method=user.getrecenttracks&user=' + username + '&api_key=' + lastfmKey + '&limit=200&format=json&from=' + fromParam + '&to=' + toParam + '&page=' + i,
                    success: function(data) {
                        if (data.error) {
                            console.log('ERROR [data.getLastfmTracks]:' + data.message);
                            handleError();
                        }
                        else {
                            var current = parseInt(data.recenttracks['@attr'].page);
                            console.log('Done page: ' + current);
                            allData = allData.concat(data.recenttracks.track);
                        }
                    }
                });

                promises.push(promise);
            }

            $.when.apply(null, promises).done(function(){
                console.log('all data done!!');

                if(callback) {
                    callback(allData);
                }
                return;
            });
        }

        $.ajax({
            url: lastfmBase + '?method=user.getrecenttracks&user=' + username + '&api_key=' + lastfmKey + '&limit=200&format=json&from=' + fromParam + '&to=' + toParam,
            success: function(data) {
                if (data.error) {
                    console.log('ERROR [data.getLastfmTracks]:' + data.message);
                    handleError();
                }
                else {
                    var total = parseInt(data.recenttracks['@attr'].totalPages);
                    console.log('Total Page: ' + total);
                    allData = allData.concat(data.recenttracks.track);
                    recentTracks(total);
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
                    handleError();
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

    var getLastfmUserInfo = function(username, callback) {
        console.log('getting ' + username + '\'s info!');

        $.ajax({
            url: lastfmBase + '?method=user.getInfo&user=' + username + '&api_key=' + lastfmKey + '&format=json',
            success: function(data) {
                if (data.error) {
                    console.log('ERROR [data.getLastfmUserInfo]:' + data.message);
                    handleError();
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

    var handleError = function() {
        $('.overlay').hide();
        $('.error').show();
    };

    return {
        getLastfmTracks: getLastfmTracks,
        getLastfmArtistTracks: getLastfmArtistTracks,
        getLastfmUserInfo: getLastfmUserInfo,
        handleError: handleError
    };
})();

