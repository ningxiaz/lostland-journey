// starting point of the app


journey.lastfm.getLastfmTracks('thmmrs2298', new Date(2014, 11, 1), new Date(2014, 11, 23), function(data) {
    var dailyCounts = journey.data.computeDailyCounts(data);
    console.log(dailyCounts);
    var numArtists = Object.keys(dailyCounts).length;
    var normalizedCounts = journey.data.normalizeDailyCounts(dailyCounts);
    console.log(normalizedCounts);

    var visWidth = $(document).width();
    var visHeight = $(document).height()*0.7;
    journey.vis.trackBubbles(normalizedCounts, numArtists, visWidth, visHeight);
});


// journey.data.getLastfmArtistTracks('thmmrs2298', 'Kate Bush', function(data) {
//     var counts = journey.data.computeArtistDailyCounts(data.artisttracks.track);
//     console.log(counts);
// });
