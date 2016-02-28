// vis module
// responsible for all the data visualization part

journey.timeline = (function() {

    // start, end are Date objects
    var draw = function(start, end, visWidth, extentLeft, extentRight) {
        console.log(start);
        console.log(end);

        var data = [{x: start, y: 0.5}, {x: end, y: 0.5}];

        var maxR = 32;
        var margin = {top: 0, left: maxR, right: maxR, bottom: 0};
        var width = visWidth - margin.left - margin.right;
        var height = 60 - margin.top - margin.bottom;

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
                    .on('brush', brushing)
                    .on('brushend', brushed);

        // set the current extent
        brush.extent([extentLeft, extentRight]);

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
            var selectedExtent = brush.extent();
            journey.vis.updateDailyBubbles(selectedExtent[0], selectedExtent[1]);
            updateTimeTitle(selectedExtent[0], selectedExtent[1]);
        }

        function brushing() {
            var selectedExtent = brush.extent();
            updateTimeTitle(selectedExtent[0], selectedExtent[1]);
        }
    };

    var updateTimeTitle = function(start, end) {
        $('.timeTitle span').text(start.toDateString() + ' - ' + end.toDateString());
    };

    return {
        draw: draw,
        updateTimeTitle: updateTimeTitle
    };
})();