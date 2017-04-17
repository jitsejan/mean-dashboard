// Refills service used to communicate Refills REST endpoints
(function () {
  'use strict';

  angular
    .module('refills')
    .factory('RefillsService', RefillsService);

  RefillsService.$inject = ['$resource'];

  function RefillsService($resource) {
    return $resource('api/refills/:refillId', {
      refillId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
