// starting point of the app


journey.data.getLastfmTracks('thmmrs2298', new Date(2014, 11, 1), new Date(2014, 11, 23), function(data) {
    console.log(journey.data.computeDailyCounts(data));
});


// journey.data.getLastfmArtistTracks('thmmrs2298', 'Kate Bush', function(data) {
//     var counts = journey.data.computeArtistDailyCounts(data.artisttracks.track);
//     console.log(counts);
// });
