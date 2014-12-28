// starting point of the app


journey.lastfm.getLastfmTracks('thmmrs2298', new Date(2014, 6, 1), new Date(2014, 9, 1), function(data) {
    var dailyCounts = journey.data.computeDailyCounts(data);
    console.log(dailyCounts);
    var normalizedCounts = journey.data.normalizeDailyCounts(dailyCounts);
    console.log(normalizedCounts);

    var visWidth = $(window).width();
    journey.vis.lineDetails(normalizedCounts, visWidth);
    // journey.vis.trendBubbles(normalizedCounts, visWidth);
});


// journey.data.getLastfmArtistTracks('thmmrs2298', 'Kate Bush', function(data) {
//     var counts = journey.data.computeArtistDailyCounts(data.artisttracks.track);
//     console.log(counts);
// });
