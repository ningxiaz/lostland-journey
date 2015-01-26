// vis module
// responsible for all the data visualization part

journey.timeline = (function() {

    // start, end are Date objects
    var draw = function(start, end, visWidth) {
        console.log(start);
        console.log(end);

        var data = [{x: start, y: 0.5}, {x: end, y: 0.5}];

        var maxR = 40;
        var margin = {top: maxR/2, left: maxR, right: maxR, bottom: maxR/2};
        var width = visWidth - margin.left - margin.right;
        var height = 100 - margin.top - margin.bottom;

        var x = d3.time.scale().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);

        var svg = d3.select('.timelineVis').append('svg')
                    .attr('width', visWidth)
                    .attr('height', height + margin.top + margin.bottom)
                .append('g')
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain([start, end]);
        y.domain([0, 1]);

        var line = d3.svg.line()
                    .x(function(d) {
                        return x(d.x);
                    })
                    .y(function(d) {
                        return y(d.y);
                    })
                    .interpolate("linear");

        var brush = d3.svg.brush()
                    .x(x)
                    .on('brushend', brushed);

        svg.selectAll('.timeline')
            .data([data])   // single svg element
            .enter()
            .append('svg:g')
            .append('path')
            .attr('class', 'timeline')
            .style('stroke', '#555')
            .style('stroke-width', '1px')
            .attr('d', line);

        svg.append('g')
                .attr('class', 'brush')
                .call(brush)
            .selectAll('rect')
                .attr('y', 0)
                .attr('height', height)
                .style('fill', '#fff')
                .style('fill-opacity', 0.25)
                .style('shape-rendering', 'crispEdges');

        function brushed() {
            console.log(brush.extent());
        }
    };

    return {
        draw: draw
    };
})();