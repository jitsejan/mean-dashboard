(function () {
  'use strict';

  angular
    .module('refills')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Refills',
      state: 'refills',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'refills', {
      title: 'List Refills',
      state: 'refills.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'refills', {
      title: 'Create Refill',
      state: 'refills.create',
      roles: ['user']
    });
  }
}());
