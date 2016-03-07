// vis module
// responsible for all the data visualization part

journey.vis = (function() {
    var svg;

    var dailyBubbles = function(counts, visWidth) {
        var _this = this;

        var timeParse = d3.time.format('%Y-%m-%d').parse;

        var linesData = [];

        counts.forEach(function(d) {
            d.date = timeParse(d.date);
        });

        var maxR = 32;
        var margin = {top: 0, left: maxR, right: maxR, bottom: 0};
        var width = visWidth - margin.left - margin.right;
        var height = 300 - margin.top - margin.bottom;

        var color =  d3.scale.category20();

        var x = d3.time.scale().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);
        var r = d3.scale.linear().range([0, maxR]);

        svg = d3.select('.musicVis').append('svg')
                    .attr('width', visWidth)
                    .attr('height', height + margin.top + margin.bottom)
                .append('g')
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(counts, function(d) { return d.date; }));
        // var minCount = d3.min(counts, function(d) {return d3.min(d.artists, function(d) { return d.count })});
        var maxCount = d3.max(counts, function(d) {return d3.max(d.artists, function(d) { return d.count })});
        r.domain([0, maxCount]);
        console.log('maxCount: ' + maxCount);

        function computeOverlap(prevCount, currCount) {
            // if the smaller circle is too small, separate them
            if(currCount < maxCount*0.4) {
                return 3;
            }
            // if they're both kinda big, given them a bit overlap
            return - currCount*0.4;
        }

        // offsets are on the same scale as r
        counts.forEach(function(date) {
            var artistsList = date.artists;
            artistsList.forEach(function(artist, i) {
                if(i === 0) {
                    artist.offset = 0;
                    return;
                }

                var prevCount = 0;
                var prevOffset = 0;
                var overlap = 0;
                // for even elements
                if(i % 2 === 0) {
                    prevCount = artistsList[i - 2].count;
                    prevOffset = artistsList[i - 2].offset;
                    overlap = computeOverlap(prevCount, artist.count);
                    artist.offset = prevOffset + r(prevCount + overlap + artist.count);
                    return;
                }
                // for odd elements
                prevCount = (i === 1) ? artistsList[0].count : artistsList[i - 2].count;
                prevOffset = (i === 1) ? artistsList[0].offset : artistsList[i - 2].offset;
                overlap = computeOverlap(prevCount, artist.count);
                artist.offset = - ((- prevOffset) + r(prevCount + overlap + artist.count));
                return;
            });
        });

        y.domain([-1, 1]);

        // x axis
        var xAxis = d3.svg.axis().scale(x).orient('bottom').tickSize(height/2 - 20).ticks(6);

        svg.append('g')
            .attr('class', 'vis-axis')
            .attr('transform', 'translate(0, ' + height/2 + ')')
            .call(xAxis);

        var bubbles = svg.selectAll('.date')
                .data(counts)
            .enter().append('svg:g')
            .selectAll('.bubble')
                .data(function(d) {return d.artists})
            .enter().append('circle')
                .attr('class', 'bubble')
                .attr('r', function(d) {
                    return r(d.count)
                })
                .attr('cx', function(d) {return x(timeParse(d.date))})
                .attr('cy', function(d) {
                    // from the middle, it's not guaranteed this will be within our svg area
                    return 0.5*height + d.offset;
                })
                .style('fill', function(d) {return color(d.artist)})
                .style('opacity', 0.7)
                .on('mouseover', function(d) {
                    var artistName = d.artist;

                    d3.selectAll('.bubble')
                        .filter(function(d) {
                            return d.artist !== artistName;
                        })
                        .transition()
                        .style('fill', '#444');
                })
                .on('mouseout', function() {
                    d3.selectAll('.bubble')
                        .transition()
                        .style('fill', function(d) {return color(d.artist)});
                })
                .on('click', function(d) {
                    var artistName = d.artist;

                    _this.showArtistCard(artistName);
                });

    };

    var updateDailyBubbles = function(start, end) {
        $('.overlay').show();
        $('.artistInfo').hide();
        journey.lastfm.getLastfmTracks(journey.username, start, end, function(data) {
            var dailyCounts = journey.data.computeDateArtistCounts(data);

            var normalizedCounts = journey.data.normalizeAndSort(dailyCounts);
            console.log('normalizedCounts');
            console.log(normalizedCounts);

            journey.artist.clearAllStats();
            journey.artist.computeArtistStats(data);

            journey.aggregate.prepareAggregateStats();
            journey.aggregate.updateAggregateStats();

            $('.overlay').hide();

            var visWidth = $(window).width();
            console.log('about to update!');
            $('.musicVis').empty();
            journey.vis.dailyBubbles(normalizedCounts, visWidth);
        });
    };

    var showArtistCard = function(artistName) {
        // clear previous appends
        $('.artistInfo-albums').empty();
        $('.artistInfo-tracks').empty();

        $('.aggregateInfo').hide();
        $('.artistInfo').show();
        $('.artistInfo-artistName').text(artistName);
        var artistInfo = journey.artist.getArtistInfo(artistName);
        if(artistInfo === null) return;

        artistInfo.albums.forEach(function(album) {
            var albumDiv = $('<div/>', {
                'class': 'info-album clearfix'
            }).appendTo('.artistInfo-albums');

            $('<img>', {
                'src': album.image
            }).appendTo(albumDiv);

            $('<div/>', {
                'class': 'info-albumName'
            }).text(album.name).appendTo(albumDiv);

            $('<div/>', {
                'class': 'info-albumCount'
            }).text(album.count).appendTo(albumDiv);
        });

        artistInfo.topTracks.slice(0, 10).forEach(function(track){
            var trackDiv = $('<div/>', {
                'class': 'info-track clearfix'
            }).appendTo('.artistInfo-tracks');

            $('<div/>', {
                'class': 'info-trackName'
            }).text(track.name).appendTo(trackDiv);

            $('<div/>', {
                'class': 'info-trackCount'
            }).text(track.count).appendTo(trackDiv);
        });

        $('.artistInfo-total span').text(artistInfo.total);
    };

    // var trendBubbles = function(counts, visWidth) {
    //     var timeParse = d3.time.format('%Y-%m-%d').parse;

    //     var linesData = [];

    //     counts.forEach(function(d) {
    //         d.date = timeParse(d.date);
    //     });

    //     var maxR = 40;
    //     var margin = {top: maxR/2, left: maxR, right: maxR, bottom: maxR};
    //     var width = visWidth - margin.left - margin.right;
    //     var height = 400 - margin.top - margin.bottom;

    //     var color =  d3.scale.category20b();

    //     var x = d3.time.scale().range([margin.left, margin.left + width]);
    //     var y = d3.scale.linear().range([height, 0]);
    //     var r = d3.scale.linear().range([3, maxR]);

    //     var xAxis = d3.svg.axis().scale(x).orient('bottom');

    //     var svg = d3.select('.musicVis').append('svg')
    //                 .attr('width', visWidth)
    //                 .attr('height', 400 + margin.top + margin.bottom)
    //             .append('g');

    //     x.domain(d3.extent(counts, function(d) { return d.date; }));
    //     y.domain([0, 1]);
    //     r.domain(d3.extent(counts, function(d) { return d.count; }));

    //     // method to draw horizontal lines
    //     var line = d3.svg.line()
    //                 .x(function(d, i) {return (i*width + margin.left)})
    //                 .y(function(d) {
    //                     return y(d);
    //                 })
    //                 .interpolate("linear");

    //     var lineData = [[0.5, 0.5]];

    //     svg.selectAll('.line')
    //         .data(lineData)
    //         .enter()
    //         .append('svg:g')
    //         .append('path')
    //         .attr('class', 'line')
    //         .style('stroke', '#555')
    //         .style('stroke-width', '1px')
    //         .attr('d', line);

    //     // svg.selectAll('.label')
    //     //     .data(counts)
    //     //     .enter()
    //     //     .append('svg:title')
    //     //     .attr('x', function(d) {return x(d.date)})
    //     //     .attr('y', function(d) {return y(0.5) - r(d.count)})
    //     //     .text(function(d) {return d.artist});

    //     svg.selectAll('.bubble')
    //             .data(counts)
    //         .enter().append('circle')
    //             .attr('class', 'bubble')
    //             .attr('r', function(d) {
    //                 return r(d.count)
    //             })
    //             .attr('cx', function(d) {return x(d.date)})
    //             .attr('cy', function(d) {
    //                 return y(0.5);
    //             })
    //             .style('fill', function(d) {return color(d.artist)})
    //             .style('opacity', 0.8);

    //     console.log(yArtist);
    // };

    // var lineDetails = function(counts, visWidth) {
    //     var timeParse = d3.time.format('%Y-%m-%d').parse;

    //     // to keep the same artists on the same row
    //     var yArtist = {};

    //     var linesData = [];

    //     counts.forEach(function(d) {
    //         d.date = timeParse(d.date);
    //         if(!yArtist.hasOwnProperty(d.artist)) {
    //             var newY = Object.keys(yArtist).length;
    //             yArtist[d.artist] = newY;
    //             linesData.push([newY, newY]);
    //         }
    //     });

    //     var numArtists = linesData.length;

    //     var maxR = 30;
    //     var margin = {top: maxR/2, left: maxR, right: maxR, bottom: maxR};
    //     var lineHeight = 30;
    //     var width = visWidth - margin.left - margin.right;
    //     var height = lineHeight*numArtists - margin.top - margin.bottom;

    //     var color =  d3.scale.category20b();

    //     var x = d3.time.scale().range([margin.left, margin.left + width]);
    //     var y = d3.scale.linear().range([height, 0]);
    //     var r = d3.scale.linear().range([3, maxR]);

    //     var xAxis = d3.svg.axis().scale(x).orient('bottom');

    //     var svg = d3.select('.musicVis').append('svg')
    //                 .attr('width', visWidth)
    //                 .attr('height', lineHeight*numArtists)
    //             .append('g');

    //     x.domain(d3.extent(counts, function(d) { return d.date; }));
    //     y.domain([0, numArtists]);
    //     r.domain(d3.extent(counts, function(d) { return d.count; }));

    //     // method to draw horizontal lines
    //     var line = d3.svg.line()
    //                 .x(function(d, i) {return (i*width + margin.left)})
    //                 .y(function(d) {
    //                     return y(d);
    //                 })
    //                 .interpolate("linear");

    //     svg.selectAll('.line')
    //         .data(linesData)
    //         .enter()
    //         .append('svg:g')
    //         .append('path')
    //         .attr('class', 'line')
    //         .style('stroke', '#555')
    //         .style('stroke-width', '1px')
    //         .attr('d', line);

    //     svg.selectAll('.bubble')
    //             .data(counts)
    //         .enter().append('circle')
    //             .attr('class', 'bubble')
    //             .attr('r', function(d) {
    //                 return r(d.count)
    //             })
    //             .attr('cx', function(d) {return x(d.date)})
    //             .attr('cy', function(d) {
    //                 return y(yArtist[d.artist]);
    //             })
    //             .style('fill', function(d) {return color(d.artist)})
    //             .style('opacity', 0.8);

    //     console.log(yArtist);

    // };

    return {
        dailyBubbles: dailyBubbles,
        updateDailyBubbles: updateDailyBubbles,
        showArtistCard: showArtistCard,
        // trendBubbles: trendBubbles,
        // lineDetails: lineDetails
    };
})();