(function () {
  'use strict';

  angular
    .module('refills')
    .directive('barChart', barChart);

  barChart.$inject = ['$window'];

  function barChart($window) {
    return {
      template: '<svg class="bar-chart" width="960" height="500"></svg>',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        var d3 = $window.d3;
        var data = scope.vm.refills;
        
        console.log(d3.version);
        console.log(data);
        // SVG
        var svg = d3.select('svg.bar-chart'),
          margin = { top: 20, right: 20, bottom: 130, left: 50 },
          width = +svg.attr('width') - margin.left - margin.right,
          height = +svg.attr('height') - margin.top - margin.bottom,
          g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        
        // Graph title
        g.append("text")
          .attr("x", (width / 2))             
          .attr("y", 0 - (margin.top / 3))
          .attr("text-anchor", "middle")  
          .style("font-size", "16px") 
          .text("Volume per refill");
          
        var parseTime = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ');
        var x = d3.scaleBand().range([0, width]).padding(0.1);
        var y = d3.scaleLinear().rangeRound([height, 0]);
        
        x.domain(data.map(function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.volume; })]);
        
        // X axis
        g.append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .attr("class", "x axis")
          .call(d3.axisBottom(x).tickFormat(function(d){ return d}))
          .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });
        // Y axis
        g.append('g')
          .call(d3.axisLeft(y))
        // Bars
        g.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.date); })
          .attr("width", x.bandwidth())
          .attr("y", function(d) { return y(d.volume); })
          .attr("height", function(d) { return height - y(d.volume); });

      }
    };
  }
})();
