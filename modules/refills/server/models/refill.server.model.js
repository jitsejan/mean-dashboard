'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Refill Schema
 */
var RefillSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Refill name',
    trim: true
  },
  date: {
    type: Date,
    required: 'Please fill Refill date'
  },
  kilometers: {
    type: Number,
    default: 0,
    required: 'Please fill Refill kilometers'
  },
  volume: {
    type: Number,
    default: 0,
    required: 'Please fill Refill volume'
  },
  price: {
    type: Number,
    default: 0,
    required: 'Please fill Refill litre price'
  },
  cost: {
    type: Number,
    default: 0,
    required: 'Please fill Refill cost'
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Refill', RefillSchema);
