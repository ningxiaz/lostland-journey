// vis module
// responsible for all the data visualization part

journey.vis = (function() {
    var trackBubbles = function(counts, numArtists, visWidth, visHeight) {
        var maxR = 30;
        var margin = {top: maxR/2, left: maxR, right: maxR, bottom: maxR};
        var width = visWidth - margin.left - margin.right;
        var height = 30*numArtists - margin.top - margin.bottom;
        
        console.log(width);
        console.log(height);
        // to keep the same artists on the same row
        var yUnit = height / numArtists;
        var yArtist = {};

        var timeParse = d3.time.format('%Y-%m-%d').parse;

        var color =  d3.scale.category20b();

        var x = d3.time.scale().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);
        var r = d3.scale.linear().range([0, maxR]);

        var xAxis = d3.svg.axis().scale(x).orient('bottom');

        var svg = d3.select('.musicVis').append('svg')
                    .attr('width', visWidth)
                    .attr('height', 30*numArtists)
                .append('g');

        counts.forEach(function(d) {
            d.date = timeParse(d.date);
        });

        x.domain(d3.extent(counts, function(d) { return d.date; }));
        y.domain([0, numArtists]);
        r.domain(d3.extent(counts, function(d) { return d.count; }));

        svg.selectAll('.bubble')
                .data(counts)
            .enter().append('circle')
                .attr('class', 'bubble')
                .attr('r', function(d) {
                    return r(d.count)
                })
                .attr('cx', function(d) {return x(d.date)})
                .attr('cy', function(d) {
                    if(yArtist.hasOwnProperty(d.artist)) {
                        return y(yArtist[d.artist]);
                    }

                    var newY = Object.keys(yArtist).length;
                    yArtist[d.artist] = newY;
                    return y(newY);
                })
                .style('fill', function(d) {return color(d.artist)});

        console.log(yArtist);

    };

    return {
        trackBubbles: trackBubbles
    };
})();