(function () {
  'use strict';

  angular
    .module('refills')
    .controller('RefillsListController', RefillsListController);

  RefillsListController.$inject = ['RefillsService'];

  function RefillsListController(RefillsService) {
    var vm = this;

    vm.refills = RefillsService.query();
  }
}());
