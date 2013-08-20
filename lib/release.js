/*
 * release
 * https://github.com/danielchatfield/release
 *
 * Copyright (c) 2013 Daniel Chatfield
 * Licensed under the MIT license.
 */

'use strict';
var chalk = require('chalk');
var semver = require('semver');

var Release = module.exports;

// Constructor
function Release(dir) {
  dir = dir || process.cwd();

  // Internal channels
  var channels = {
    npm: require('./channels/npm')
  };

  // Lookup other channels (Global channels and in node_modules)
  
  // Attempt to initialize each channel
  this.channels = {};
  for( var channelName in channels) {
    var channel = new channels[channelName](dir);
    if(channel !== undefined) {
      this.channels[channelName] = channel;
    }
  }

  if(this.channels.length === 0) {
    this.throwError('Release couldn\'t identify the working directory. Run with the --verbose option for more output.');
  }

}


Release.prototype.release = function (version, options) {

  if (!version) {
    this.throwParamError('version');
  }

  this.version = version;
  this.options = options || {};

};


/**
 * Returns the current version.
 *   Asks each channel to get version and raises an exception if versions conflict.
 * @param  {String} channel    Used to specify just one release channel to ask for version.
 * @param  {Array} options
 * @return {String} version
 */
Release.prototype.currentVersion = function (channel, defaultVersion) {
  if(channel) {
    return this.channels[channel].currentVersion();
  }

  var currentVersion = this._currentVersion(true) || this._currentVersion(false) || defaultVersion;

  if(!currentVersion) {
    return this.throwError('Unable to determine current version.');
  }

  return currentVersion;
};

/**
 * Get's the greatest version number from each release channel.
 * 
 * @param  {Boolean} strict     There are circumstances when a channel may 
 *                              have additional versions. For example Node.js
 *                              has a 0.10.x
 * @return {[type]}        [description]
 */
Release.prototype._currentVersion = function (strict) {
  if(strict === undefined) {
    strict = true;
  }

  var currentVersion;

  for (var channel in this.channels) {
    var currentVersionTmp = this.channels[channel].currentVersion(strict);

    if(!currentVersionTmp) {
      continue;
    }

    // If this is not a valid version then ignore it.
    if(!semver.valid(currentVersionTmp)) {
      continue;
    }

    // Always return the greatest version we can
    if(!currentVersion || semver.gt(currentVersionTmp, currentVersion)) {
      currentVersion = currentVersionTmp;
      continue;
    }
  }

  return currentVersion;
};

/**
 * Throws a new error by joining the paramaters.
 */
Release.prototype.throwError = function () {
  throw new Error(chalk.red[0] + [].slice.call(arguments).join(' ') + chalk.red[1]);
};


/**
 * Wrapper around throwError for missing paramaters.
 * @param  {String} param The paramater that is missing.
 */
Release.prototype.throwParamError = function(param) {
  return this.throwError('No ' + chalk.cyan(param) + ' parameter provided.');
};

