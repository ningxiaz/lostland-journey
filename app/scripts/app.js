// starting point of the app

$('.start-done').click(function() {

    journey.username = $('.start-lastfm').val();
    if(journey.username === undefined || journey.username === '') {
        $('.start-error').show();
        $('.start-error').text('Sorry, I see nothing here');
        return;
    }

    $('.start').hide();
    $('.overlay').show();

    var now = new Date();
    var oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    var registeredTime;

    journey.lastfm.getLastfmUserInfo(journey.username, function(data) {
        console.log(data);
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

        $('.artistInfo-back').click(function() {
            $('.artistInfo').hide();
            $('.aggregateInfo').show();
        });
    });
});
