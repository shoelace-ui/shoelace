
/**
 * Module dependencies.
 */

var fs = require('fs')
var exists = require('fs').existsSync;
var path = require('path');
var stylus = require('stylus');
var nib = require('nib');
var cwd = process.cwd();

/**
 * Expose `build`.
 */

module.exports = build;

/**
 * If used directly, just compile. Otherwise, take options.
 * @param {Function} builder
 */

function build(builder) {
  if ('function' == typeof builder.build) return compile(builder, {});

  var options = builder;
  return function (builder) {
    compile(builder, options);
  };
}

/**
 * Compile `component-builder` instance.
 * @param {Function} builder
 * @param {Object} options
 */

function compile(builder, options) {
  builder.hook('before styles', function(pkg, cb) {
    var previewFile = cwd + '/preview/preview.styl';
    if (!exists(previewFile)) previewFile = cwd + '/preview/index.styl';
    if (!exists(previewFile)) return console.log('Couldn\'t find', previewFile)

    var styl = stylus(fs.readFileSync(previewFile, 'utf-8'))
      .include(cwd + '/components')
      .include(cwd)
      .import(path.dirname(pkg.config.styles[0]))
      .use(nib());

    styl.render(function (err, css) {
      if (err) return console.error(err);
      pkg.addFile('styles', 'preview/preview.css', css);
      cb();
    });
  });
}
