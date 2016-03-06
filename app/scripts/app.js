// starting point of the app

$('.start-done').click(function() {
    $('.start').hide();
    $('.overlay').show();

    journey.username = $('.start-lastfm').val();

    var now = new Date();
    var oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    var registeredTime;

    journey.lastfm.getLastfmUserInfo(journey.username, function(data) {
        registeredTime = new Date(parseInt(data.user.registered.unixtime) * 1000);

        var visWidth = $(window).width();
        journey.timeline.draw(registeredTime, now, visWidth, oneMonthAgo, now);
    });

    journey.lastfm.getLastfmTracks(journey.username, oneMonthAgo, now, function(data) {
        console.log('here!');
        console.log(data);
        var dailyCounts = journey.data.computeDateArtistCounts(data);
        console.log(dailyCounts);

        var normalizedCounts = journey.data.normalizeAndSort(dailyCounts);
        console.log(normalizedCounts);

        journey.artist.computeArtistStats(data);
        journey.artist.printAllStats();

        journey.aggregate.prepareAggregateStats();
        journey.aggregate.updateAggregateStats();

        $('.overlay').hide();

        var visWidth = $(window).width();
        journey.vis.dailyBubbles(normalizedCounts, visWidth);

        $('.timeTitle').show();
        journey.timeline.updateTimeTitle(oneMonthAgo, now);
    });
});
