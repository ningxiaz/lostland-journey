// view module
// update the view

journey.aggregate = (function() {
    var globalStats;
    var topArtists;
    var topTracks;

    var prepareAggregateStats = function() {
        globalStats = journey.data.getAggregateData();

        var artistInfo = journey.artist.getAllArtistInfo();

        var artistInfoArray = [];
        for (var artistName in artistInfo) {
            artistInfoArray.push({
                'name': artistName,
                'total': artistInfo[artistName].total
            });
        }
        artistInfoArray.sort(function(a, b) {
            return b.total - a.total;
        });

        console.log(artistInfoArray);
        topArtists = artistInfoArray.slice(0, 20);

        var tracksInfo = journey.artist.getAllTracksInfo();

        var tracksInfoArray = [];
        var track;
        for (var trackString in tracksInfo) {
            track = tracksInfo[trackString];
            tracksInfoArray.push({
                'name': track.name,
                'album': track.album,
                'artist': track.artist,
                'count': track.count
            });
        }
        tracksInfoArray.sort(function(a, b) {
            return b.count - a.count;
        });
        console.log(tracksInfoArray);
        topTracks = tracksInfoArray.slice(0, 20);
    };

    var updateAggregateStats = function() {
        $('.aggregateInfo-total span').text(globalStats.totalPlays);
        $('.aggregateInfo-average span').text(globalStats.averagePlays.toFixed(2));

        $('.aggregateInfo-artists').empty();
        $('.aggregateInfo-tracks').empty();

        topArtists.forEach(function(artist) {
            var artistDiv = $('<div/>', {
                'class': 'info-artist clearfix'
            }).appendTo('.aggregateInfo-artists');

            $('<div/>', {
                'class': 'info-artistName'
            }).text(artist.name).appendTo(artistDiv);

            $('<div/>', {
                'class': 'info-artistTotal'
            }).text(artist.total).appendTo(artistDiv);
        });

        topTracks.forEach(function(track){
            var trackDiv = $('<div/>', {
                'class': 'info-track clearfix'
            }).appendTo('.aggregateInfo-tracks');

            $('<div/>', {
                'class': 'info-trackName'
            }).text(track.name).appendTo(trackDiv);

            $('<div/>', {
                'class': 'info-trackCount'
            }).text(track.count).appendTo(trackDiv);
        });

        $('.aggregateInfo').show();

    };

    return {
        prepareAggregateStats: prepareAggregateStats,
        updateAggregateStats: updateAggregateStats,
    };
})();

