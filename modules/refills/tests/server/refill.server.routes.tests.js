'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Refill = mongoose.model('Refill'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  refill;

/**
 * Refill routes tests
 */
describe('Refill CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Refill
    user.save(function () {
      refill = {
        name: 'Refill name'
      };

      done();
    });
  });

  it('should be able to save a Refill if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Refill
        agent.post('/api/refills')
          .send(refill)
          .expect(200)
          .end(function (refillSaveErr, refillSaveRes) {
            // Handle Refill save error
            if (refillSaveErr) {
              return done(refillSaveErr);
            }

            // Get a list of Refills
            agent.get('/api/refills')
              .end(function (refillsGetErr, refillsGetRes) {
                // Handle Refills save error
                if (refillsGetErr) {
                  return done(refillsGetErr);
                }

                // Get Refills list
                var refills = refillsGetRes.body;

                // Set assertions
                (refills[0].user._id).should.equal(userId);
                (refills[0].name).should.match('Refill name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Refill if not logged in', function (done) {
    agent.post('/api/refills')
      .send(refill)
      .expect(403)
      .end(function (refillSaveErr, refillSaveRes) {
        // Call the assertion callback
        done(refillSaveErr);
      });
  });

  it('should not be able to save an Refill if no name is provided', function (done) {
    // Invalidate name field
    refill.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Refill
        agent.post('/api/refills')
          .send(refill)
          .expect(400)
          .end(function (refillSaveErr, refillSaveRes) {
            // Set message assertion
            (refillSaveRes.body.message).should.match('Please fill Refill name');

            // Handle Refill save error
            done(refillSaveErr);
          });
      });
  });

  it('should be able to update an Refill if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Refill
        agent.post('/api/refills')
          .send(refill)
          .expect(200)
          .end(function (refillSaveErr, refillSaveRes) {
            // Handle Refill save error
            if (refillSaveErr) {
              return done(refillSaveErr);
            }

            // Update Refill name
            refill.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Refill
            agent.put('/api/refills/' + refillSaveRes.body._id)
              .send(refill)
              .expect(200)
              .end(function (refillUpdateErr, refillUpdateRes) {
                // Handle Refill update error
                if (refillUpdateErr) {
                  return done(refillUpdateErr);
                }

                // Set assertions
                (refillUpdateRes.body._id).should.equal(refillSaveRes.body._id);
                (refillUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Refills if not signed in', function (done) {
    // Create new Refill model instance
    var refillObj = new Refill(refill);

    // Save the refill
    refillObj.save(function () {
      // Request Refills
      request(app).get('/api/refills')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Refill if not signed in', function (done) {
    // Create new Refill model instance
    var refillObj = new Refill(refill);

    // Save the Refill
    refillObj.save(function () {
      request(app).get('/api/refills/' + refillObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', refill.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Refill with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/refills/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Refill is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Refill which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Refill
    request(app).get('/api/refills/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Refill with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Refill if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Refill
        agent.post('/api/refills')
          .send(refill)
          .expect(200)
          .end(function (refillSaveErr, refillSaveRes) {
            // Handle Refill save error
            if (refillSaveErr) {
              return done(refillSaveErr);
            }

            // Delete an existing Refill
            agent.delete('/api/refills/' + refillSaveRes.body._id)
              .send(refill)
              .expect(200)
              .end(function (refillDeleteErr, refillDeleteRes) {
                // Handle refill error error
                if (refillDeleteErr) {
                  return done(refillDeleteErr);
                }

                // Set assertions
                (refillDeleteRes.body._id).should.equal(refillSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Refill if not signed in', function (done) {
    // Set Refill user
    refill.user = user;

    // Create new Refill model instance
    var refillObj = new Refill(refill);

    // Save the Refill
    refillObj.save(function () {
      // Try deleting Refill
      request(app).delete('/api/refills/' + refillObj._id)
        .expect(403)
        .end(function (refillDeleteErr, refillDeleteRes) {
          // Set message assertion
          (refillDeleteRes.body.message).should.match('User is not authorized');

          // Handle Refill error error
          done(refillDeleteErr);
        });

    });
  });

  it('should be able to get a single Refill that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Refill
          agent.post('/api/refills')
            .send(refill)
            .expect(200)
            .end(function (refillSaveErr, refillSaveRes) {
              // Handle Refill save error
              if (refillSaveErr) {
                return done(refillSaveErr);
              }

              // Set assertions on new Refill
              (refillSaveRes.body.name).should.equal(refill.name);
              should.exist(refillSaveRes.body.user);
              should.equal(refillSaveRes.body.user._id, orphanId);

              // force the Refill to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Refill
                    agent.get('/api/refills/' + refillSaveRes.body._id)
                      .expect(200)
                      .end(function (refillInfoErr, refillInfoRes) {
                        // Handle Refill error
                        if (refillInfoErr) {
                          return done(refillInfoErr);
                        }

                        // Set assertions
                        (refillInfoRes.body._id).should.equal(refillSaveRes.body._id);
                        (refillInfoRes.body.name).should.equal(refill.name);
                        should.equal(refillInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Refill.remove().exec(done);
    });
  });
});
