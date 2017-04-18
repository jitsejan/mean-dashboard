(function () {
  'use strict';

  angular
    .module('refills')
    .directive('lineChart', lineChart);

  lineChart.$inject = ['$window'];

  function lineChart($window) {
    return {
      template: '<svg width="960" height="500"></svg>',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        var d3 = $window.d3;
        var data = scope.vm.refills;
        
        console.log(d3.version);
        console.log(data);
        
        var svg = d3.select('svg'),
          margin = { top: 20, right: 20, bottom: 30, left: 50 },
          width = +svg.attr('width') - margin.left - margin.right,
          height = +svg.attr('height') - margin.top - margin.bottom,
          g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        
        // 2017-04-18T22:35:19.352Z
        var parseTime = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ');
        
        var x = d3.scaleTime().rangeRound([0, width]);
        var y = d3.scaleLinear().rangeRound([height, 0]);
        
        var line = d3.line()
          .x(function(d) { 
            return x(parseTime(d.date)); 
          })
          .y(function(d) { 
            return y(d.kilometers); 
          });
        
        x.domain(d3.extent(data, function(d) { return parseTime(d.date); }));
        y.domain(d3.extent(data, function(d) { return d.kilometers; }));
        
        
        g.append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .call(d3.axisBottom(x))
        .select('.domain')
          .remove();
          
        g.append('g')
          .call(d3.axisLeft(y))
        .append('text')
          .attr('fill', '#000')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '0.71em')
          .attr('text-anchor', 'end')
          .text('Amount of kilometers');
        
        g.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', 'steelblue')
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('stroke-width', 1.5)
          .attr('d', line);
        
      }
    };
  }
})();
