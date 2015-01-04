// starting point of the app

$('.start-done').click(function() {
    $('.start').hide();
    $('.preloader').show();

    var username = $('.start-lastfm').val();
    var start = new Date($('.start-startdate').val());
    var end = new Date($('.start-enddate').val());
    
    journey.lastfm.getLastfmTracks(username, start, end, function(data) {
        var dailyCounts = journey.data.computeDateArtistCounts(data);
        console.log(dailyCounts);

        var normalizedCounts = journey.data.normalizeAndSort(dailyCounts);
        console.log(normalizedCounts);

        $('.preloader').hide();

        var visWidth = $(window).width();
        // journey.vis.lineDetails(normalizedCounts, visWidth);
        journey.vis.dailyBubbles(normalizedCounts, visWidth);
    });
});



// journey.data.getLastfmArtistTracks('thmmrs2298', 'Kate Bush', function(data) {
//     var counts = journey.data.computeArtistDailyCounts(data.artisttracks.track);
//     console.log(counts);
// });
