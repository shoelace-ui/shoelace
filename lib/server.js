
/**
 * Module dependencies.
 */

var express = require('express');
var join = require('path').resolve;
var fs = require('fs');

module.exports = function(opts) {
  opts = opts || {};
  var cwd = opts.cwd || process.cwd();
  var dir = opts.dir || 'test';
  var pkg = opts.pkg || require(join(cwd, 'component.json'));
  var view = opts.view || 'test';
  var lr_port = opts.lr_port;

  var app = express();

  app.set('views', cwd + '/' + dir);
  app.set('view engine', 'jade');
  app.use(express.static(cwd));
  app.use(function(req, res, next) {
    res.locals({
      app: pkg.repo.split('/')[1],
      dir: dir,
      lr_port: lr_port
    });
    next();
  });

  app.get('/', function(req, res, next) {
    res.render(view, function(err, body) {
      if (err) return next(err);
      res.render(join(__dirname, '../layout'), {
        body: body
      });
    });
  });

  return app;
};
