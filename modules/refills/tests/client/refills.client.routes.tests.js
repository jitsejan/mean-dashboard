(function () {
  'use strict';

  describe('Refills Route Tests', function () {
    // Initialize global variables
    var $scope,
      RefillsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _RefillsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      RefillsService = _RefillsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('refills');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/refills');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          RefillsController,
          mockRefill;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('refills.view');
          $templateCache.put('modules/refills/client/views/view-refill.client.view.html', '');

          // create mock Refill
          mockRefill = new RefillsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Refill Name'
          });

          // Initialize Controller
          RefillsController = $controller('RefillsController as vm', {
            $scope: $scope,
            refillResolve: mockRefill
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:refillId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.refillResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            refillId: 1
          })).toEqual('/refills/1');
        }));

        it('should attach an Refill to the controller scope', function () {
          expect($scope.vm.refill._id).toBe(mockRefill._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/refills/client/views/view-refill.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          RefillsController,
          mockRefill;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('refills.create');
          $templateCache.put('modules/refills/client/views/form-refill.client.view.html', '');

          // create mock Refill
          mockRefill = new RefillsService();

          // Initialize Controller
          RefillsController = $controller('RefillsController as vm', {
            $scope: $scope,
            refillResolve: mockRefill
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.refillResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/refills/create');
        }));

        it('should attach an Refill to the controller scope', function () {
          expect($scope.vm.refill._id).toBe(mockRefill._id);
          expect($scope.vm.refill._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/refills/client/views/form-refill.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          RefillsController,
          mockRefill;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('refills.edit');
          $templateCache.put('modules/refills/client/views/form-refill.client.view.html', '');

          // create mock Refill
          mockRefill = new RefillsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Refill Name'
          });

          // Initialize Controller
          RefillsController = $controller('RefillsController as vm', {
            $scope: $scope,
            refillResolve: mockRefill
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:refillId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.refillResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            refillId: 1
          })).toEqual('/refills/1/edit');
        }));

        it('should attach an Refill to the controller scope', function () {
          expect($scope.vm.refill._id).toBe(mockRefill._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/refills/client/views/form-refill.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
