/*
 * release
 * https://github.com/danielchatfield/release
 *
 * Copyright (c) 2013 Daniel Chatfield
 * Licensed under the MIT license.
 */

'use strict';
var chalk = require('chalk');

var release = module.exports;

release.packages = {
  npm     : require('./packages/npm')
};

var throwError = function () {
  throw new Error(chalk.red[0] + [].slice.call(arguments).join(' ') + chalk.red[1]);
};

var throwParamError = function(param) {
  return throwError('No ' + chalk.cyan(param) + ' parameter provided.');
};

/**
 * Returns the current version.
 *   Asks each package to get version and raises an exception if versions conflict.
 * @param  {String} package    Used to specify just one package to target.
 * @param  {Array} options
 * @return {String} version
 */
release.currentVersion = function (package, options) {

};

release.run = function (version, options) {

  if (!version) {
    throwParamError('version');
  }

  this.version = version;
  this.options = options || {};

}.bind(release);
