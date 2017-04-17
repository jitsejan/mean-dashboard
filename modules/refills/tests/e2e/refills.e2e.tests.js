'use strict';

describe('Refills E2E Tests:', function () {
  describe('Test Refills page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/refills');
      expect(element.all(by.repeater('refill in refills')).count()).toEqual(0);
    });
  });
});
