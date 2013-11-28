
/**
 * Module dependencies.
 */

var exec = require('child_process').exec;
var resolve = require('path').resolve;
var fs = require('fs');

describe('shoelace', function() {

  beforeEach(function() {
    process.chdir('test/fixtures');
  });

  afterEach(function() {
    process.chdir('../..');
  });

  describe('--help', function() {
    it('should display help', function(done) {
      exec('../../bin/shoelace.js --help', function(err, stdout) {
        if (err) return done(err);
        stdout.should.include('Usage');
        stdout.should.include('Commands');
        done();
      });
    });
  });

  after(function(done) {
    process.chdir('test/fixtures');
    exec('make clean', function(err, stdout) {
      if (err) return done(err);
      done();
    });
  });

  describe('#build', function() {
    this.timeout(6000);
    it('should install components', function(done) {
      exec('../../bin/shoelace.js build', function(err, stdout) {
        if (err) return done(err);
        stdout.should.include('install');
        stdout.should.include('complete');
        done();
      });
    });
  });


});
