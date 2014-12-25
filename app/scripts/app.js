// starting point of the app

journey.data.getLastfmArtistTracks('thmmrs2298', 'Kate Bush', function(data) {
    var counts = journey.data.computeArtistDailyCounts(data.artisttracks.track);
    console.log(counts);
});
