#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');
var relative = require('path').relative;
var resolve = require('path').resolve;
var join = require('path').join;
var exists = require('fs').existsSync;
var spawn = require('win-fork');
var log = require('lig');
var exec = require('child_process').exec;
var cwd = process.cwd();

// usage

program
  .version(require('../package').version)
  .usage('<command>');

// sub-command help

program.on('--help', function() {
  console.log('  Commands:');
  console.log();
  console.log('    install               install local dependencies');
  console.log('    build                 build the project');
  console.log();
  process.exit();
});

// parse argv

program.parse(process.argv);

// args void of cmds

var args = process.argv.slice(3);

// command

var cmd = program.args[0];

// help

if (!cmd) program.help();

// cmds

if (cmd === 'build') installBuild(child);
if (cmd === 'install') child('install');

/**
 * Install components if necessary before building.
 * @param {Function} fn
 */

function installBuild(fn) {
  var componentsDir = resolve(process.cwd(), 'components');
  if (!exists(componentsDir)) {
    return child('install').next(function() {
      return build(fn);
    });
  }
  build(fn);
}

/**
 * Build arguments for standalone component build.
 * @param {Function} fn
 */

function build(fn) {
  var pkgPath = resolveExists([cwd, 'component.json']);
  var pkg = require(pkgPath).name;
  var stylusPath = resolveExists([__dirname, '../node_modules/component-stylus']);
  var arg = [cmd, '--standalone', pkg, '--use', relative(cwd, stylusPath)];

  fn(arg);
}

/**
 * Resolve a path and ensure it exists before returning it.
 * @param {Array} paths
 * @param {String} errMsg
 */

function resolveExists(paths, errMsg) {
  var p = resolve.apply(this, paths);
  if (!exists(p)) return log('error', 'no file or directory at ' + p);
  return p;
}

/**
 * Create and return child process.
 * @param {String} cmd
 * @param {Array} args
 */

function child(cmd) {
  cmd = cmd || [];
  var proc = spawn('component', [].concat(cmd), { stdio: 'inherit' });
  proc.on('data', function(d) {
    log('' + d);
  });
  proc.on('data', function(d) {
    log('' + d);
  });
  proc.on('close', function(code) {
    if (code === 0) return;
    process.exit(code);
  });
  proc.next = function(fn) {
    proc.on('close', fn);
  };
  return proc;
}

