'use strict';

/**
 * Module dependencies
 */
var refillsPolicy = require('../policies/refills.server.policy'),
  refills = require('../controllers/refills.server.controller');

module.exports = function(app) {
  // Refills Routes
  app.route('/api/refills').all(refillsPolicy.isAllowed)
    .get(refills.list)
    .post(refills.create);

  app.route('/api/refills/:refillId').all(refillsPolicy.isAllowed)
    .get(refills.read)
    .put(refills.update)
    .delete(refills.delete);

  // Finish by binding the Refill middleware
  app.param('refillId', refills.refillByID);
};
