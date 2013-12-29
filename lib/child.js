
var spawn = require('win-fork');

/**
 * Create and return child process.
 * @param {String} cmd
 * @param {Array} args
 */

module.exports = function(cmd, args) {
  args = args || [];
  var proc = spawn(cmd, [].concat(args), { stdio: 'inherit' });
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
