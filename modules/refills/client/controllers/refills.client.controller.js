(function () {
  'use strict';

  // Refills controller
  angular
    .module('refills')
    .controller('RefillsController', RefillsController);

  RefillsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'refillResolve'];

  function RefillsController ($scope, $state, $window, Authentication, refill) {
    var vm = this;

    vm.authentication = Authentication;
    vm.refill = refill;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Refill
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.refill.$remove($state.go('refills.list'));
      }
    }

    // Save Refill
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.refillForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.refill._id) {
        vm.refill.$update(successCallback, errorCallback);
      } else {
        vm.refill.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('refills.view', {
          refillId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
