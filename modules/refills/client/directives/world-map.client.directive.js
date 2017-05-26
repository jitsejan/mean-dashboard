(function () {
  'use strict';

  angular
    .module('refills')
    .directive('worldMap', worldMap);

  worldMap.$inject = ['$window'];

  function worldMap($window) {
    return {
      template: '<svg class="world-map" width="960" height="500"></svg>',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        var d3 = $window.d3;
        var topojson = $window.topojson;
        var data = scope.vm.refills;
        var svg = d3.select('svg.world-map'),
          margin = { top: 20, right: 20, bottom: 130, left: 50 },
          width = +svg.attr('width') - margin.left - margin.right,
          height = +svg.attr('height') - margin.top - margin.bottom,
          scale0 = (width - 1) / 2 / Math.PI,
          g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
          
        svg.append('rect')
          .attr('class', 'overlay')
          .attr('width', width)
          .attr('height', height);    
        
        // Define the div for the tooltip
        var div = d3.select('body').append('div')	
            .attr('class', 'tooltip')				
            .style('opacity', 0);    
      
        var projection = d3.geo.mercator()
          .center([0, 5 ])
          .scale(200)
          .rotate([0,0]);
      
        var path = d3.geo.path()
          .projection(projection);
          
        var zoom = d3.behavior.zoom()
          .on('zoom',function() {
            g.attr('transform','translate('+ 
              d3.event.translate.join(',')+')scale('+d3.event.scale+')');
            g.selectAll('circle')
              .attr('d', path.projection(projection));
            g.selectAll('path')  
              .attr('d', path.projection(projection)); 
          });
        
        // Graph title
        g.append('text')
          .attr('x', (width / 2))             
          .attr('y', 0 - (margin.top / 3))
          .attr('text-anchor', 'middle')  
          .style('font-size', '16px') 
          .text('Locations');
        
        d3.json('https://unpkg.com/world-atlas@1/world/50m.json', function(error, world) {
          if (error) throw error;
  
          g.append('path')
            .datum({ type: 'Sphere' })
            .attr('class', 'sphere')
            .attr('d', path);
        
          g.append('path')
            .datum(topojson.merge(world, world.objects.countries.geometries))
            .attr('class', 'land')
            .attr('d', path);
        
          g.append('path')
            .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
            .attr('class', 'boundary')
            .attr('d', path);

          g.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx',function(d) {
              return projection([d.longitude, d.latitude])[0];
            })
            .attr('cy',function(d) {
              return projection([d.longitude, d.latitude])[1];
            })
            .attr('r', 5)
            .style('fill', 'red');
        });
        
        svg
          .call(zoom)
          .call(zoom.event);
        
      }
    };
  }
})();
