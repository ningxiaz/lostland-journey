// vis module
// responsible for all the data visualization part

journey.vis = (function() {
    var trendBubbles = function(counts, visWidth) {
        var timeParse = d3.time.format('%Y-%m-%d').parse;

        var linesData = [];

        counts.forEach(function(d) {
            d.date = timeParse(d.date);
        });

        var maxR = 40;
        var margin = {top: maxR/2, left: maxR, right: maxR, bottom: maxR};
        var width = visWidth - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;

        var color =  d3.scale.category20b();

        var x = d3.time.scale().range([margin.left, margin.left + width]);
        var y = d3.scale.linear().range([height, 0]);
        var r = d3.scale.linear().range([3, maxR]);

        var xAxis = d3.svg.axis().scale(x).orient('bottom');

        var svg = d3.select('.musicVis').append('svg')
                    .attr('width', visWidth)
                    .attr('height', 400 + margin.top + margin.bottom)
                .append('g');        

        x.domain(d3.extent(counts, function(d) { return d.date; }));
        y.domain([0, 1]);
        r.domain(d3.extent(counts, function(d) { return d.count; }));

        // method to draw horizontal lines
        var line = d3.svg.line()
                    .x(function(d, i) {return (i*width + margin.left)})
                    .y(function(d) {
                        return y(d);
                    })
                    .interpolate("linear");

        var lineData = [[0.5, 0.5]];

        svg.selectAll('.line')
            .data(lineData)
            .enter()
            .append('svg:g')
            .append('path')
            .attr('class', 'line')
            .style('stroke', '#555')
            .style('stroke-width', '1px')
            .attr('d', line);

        // svg.selectAll('.label')
        //     .data(counts)
        //     .enter()
        //     .append('svg:title')
        //     .attr('x', function(d) {return x(d.date)})
        //     .attr('y', function(d) {return y(0.5) - r(d.count)})
        //     .text(function(d) {return d.artist});

        svg.selectAll('.bubble')
                .data(counts)
            .enter().append('circle')
                .attr('class', 'bubble')
                .attr('r', function(d) {
                    return r(d.count)
                })
                .attr('cx', function(d) {return x(d.date)})
                .attr('cy', function(d) {
                    return y(0.5);
                })
                .style('fill', function(d) {return color(d.artist)})
                .style('opacity', 0.8);

        console.log(yArtist);
    };

    var lineDetails = function(counts, visWidth) {
        var timeParse = d3.time.format('%Y-%m-%d').parse;

        // to keep the same artists on the same row
        var yArtist = {};

        var linesData = [];

        counts.forEach(function(d) {
            d.date = timeParse(d.date);
            if(!yArtist.hasOwnProperty(d.artist)) {
                var newY = Object.keys(yArtist).length;
                yArtist[d.artist] = newY;
                linesData.push([newY, newY]);
            }
        });

        var numArtists = linesData.length;

        var maxR = 30;
        var margin = {top: maxR/2, left: maxR, right: maxR, bottom: maxR};
        var lineHeight = 30;
        var width = visWidth - margin.left - margin.right;
        var height = lineHeight*numArtists - margin.top - margin.bottom;

        var color =  d3.scale.category20b();

        var x = d3.time.scale().range([margin.left, margin.left + width]);
        var y = d3.scale.linear().range([height, 0]);
        var r = d3.scale.linear().range([3, maxR]);

        var xAxis = d3.svg.axis().scale(x).orient('bottom');

        var svg = d3.select('.musicVis').append('svg')
                    .attr('width', visWidth)
                    .attr('height', lineHeight*numArtists)
                .append('g');        

        x.domain(d3.extent(counts, function(d) { return d.date; }));
        y.domain([0, numArtists]);
        r.domain(d3.extent(counts, function(d) { return d.count; }));

        // method to draw horizontal lines
        var line = d3.svg.line()
                    .x(function(d, i) {return (i*width + margin.left)})
                    .y(function(d) {
                        return y(d);
                    })
                    .interpolate("linear");

        svg.selectAll('.line')
            .data(linesData)
            .enter()
            .append('svg:g')
            .append('path')
            .attr('class', 'line')
            .style('stroke', '#555')
            .style('stroke-width', '1px')
            .attr('d', line);

        svg.selectAll('.bubble')
                .data(counts)
            .enter().append('circle')
                .attr('class', 'bubble')
                .attr('r', function(d) {
                    return r(d.count)
                })
                .attr('cx', function(d) {return x(d.date)})
                .attr('cy', function(d) {
                    return y(yArtist[d.artist]);
                })
                .style('fill', function(d) {return color(d.artist)})
                .style('opacity', 0.8);

        console.log(yArtist);

    };

    return {
        trendBubbles: trendBubbles,
        lineDetails: lineDetails
    };
})();