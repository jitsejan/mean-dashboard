'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Refill = mongoose.model('Refill'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Refill
 */
exports.create = function(req, res) {
  var refill = new Refill(req.body);
  refill.user = req.user;

  refill.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(refill);
    }
  });
};

/**
 * Show the current Refill
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var refill = req.refill ? req.refill.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  refill.isCurrentUserOwner = req.user && refill.user && refill.user._id.toString() === req.user._id.toString();

  res.jsonp(refill);
};

/**
 * Update a Refill
 */
exports.update = function(req, res) {
  var refill = req.refill;

  refill = _.extend(refill, req.body);

  refill.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(refill);
    }
  });
};

/**
 * Delete an Refill
 */
exports.delete = function(req, res) {
  var refill = req.refill;

  refill.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(refill);
    }
  });
};

/**
 * List of Refills
 */
exports.list = function(req, res) {
  Refill.find().sort('+date').populate('user', 'displayName').exec(function(err, refills) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(refills);
    }
  });
};

/**
 * Refill middleware
 */
exports.refillByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Refill is invalid'
    });
  }

  Refill.findById(id).populate('user', 'displayName').exec(function (err, refill) {
    if (err) {
      return next(err);
    } else if (!refill) {
      return res.status(404).send({
        message: 'No Refill with that identifier has been found'
      });
    }
    req.refill = refill;
    next();
  });
};
