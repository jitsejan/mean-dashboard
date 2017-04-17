(function () {
  'use strict';

  angular
    .module('refills')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('refills', {
        abstract: true,
        url: '/refills',
        template: '<ui-view/>'
      })
      .state('refills.list', {
        url: '',
        templateUrl: 'modules/refills/client/views/list-refills.client.view.html',
        controller: 'RefillsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Refills List'
        }
      })
      .state('refills.create', {
        url: '/create',
        templateUrl: 'modules/refills/client/views/form-refill.client.view.html',
        controller: 'RefillsController',
        controllerAs: 'vm',
        resolve: {
          refillResolve: newRefill
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Refills Create'
        }
      })
      .state('refills.edit', {
        url: '/:refillId/edit',
        templateUrl: 'modules/refills/client/views/form-refill.client.view.html',
        controller: 'RefillsController',
        controllerAs: 'vm',
        resolve: {
          refillResolve: getRefill
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Refill {{ refillResolve.name }}'
        }
      })
      .state('refills.view', {
        url: '/:refillId',
        templateUrl: 'modules/refills/client/views/view-refill.client.view.html',
        controller: 'RefillsController',
        controllerAs: 'vm',
        resolve: {
          refillResolve: getRefill
        },
        data: {
          pageTitle: 'Refill {{ refillResolve.name }}'
        }
      });
  }

  getRefill.$inject = ['$stateParams', 'RefillsService'];

  function getRefill($stateParams, RefillsService) {
    return RefillsService.get({
      refillId: $stateParams.refillId
    }).$promise;
  }

  newRefill.$inject = ['RefillsService'];

  function newRefill(RefillsService) {
    return new RefillsService();
  }
}());
