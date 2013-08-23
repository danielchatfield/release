/*
 * release
 * https://github.com/danielchatfield/release
 *
 * Copyright (c) 2013 Daniel Chatfield
 * Licensed under the MIT license.
 */

'use strict';
var async = require('async');
var chalk = require('chalk');
var semver = require('semver');

module.exports = Release;

/**
 * Main constructor
 * @param {String} dir       Current Working Directory
 * @param {[type]} options   Hash of options
 */
function Release(dir, options) {
  this.dir = dir || process.cwd();
  this.options = options || {};

  if(this.options.debug) {
    process.env.DEBUG += ' release*';
  }

  // Attach debugger
  this._debug = require('debug')('release'); 

  // Internal channels
  var channels = {
    npm: require('./channels/npm')
  };

  // Lookup other channels (Global channels and in node_modules)
  
  // Attempt to initialize each channel
  this.channels = [];
  var methods = {
    debug: this.debug,
    error: this.error,
    exit: this.exit
  };
  for( var channelName in channels) {
    var channel = new channels[channelName](this.dir, methods);
    if(channel.isPackage()) {
      this.debug("Initialised %s channel", channelName);
      this.channels.push(channel);
    } else {
      this.debug('Failed to initialise "%s" channel', channelName);
    }
  }

  return this;
}

/**
 * Wrapper around debug that colors additional args
 * @param  {String} fmt The format string
 */
Release.prototype.debug = function(fmt) {
  var args = [].slice.call(arguments, 1);
  for(var i = 0; i < args.length; i++) {
    args[i] = chalk.cyan.reset(args[i]) + chalk.styles.gray[0];
  }
  args.unshift(fmt);
  return this._debug.apply(this, args);
};

/**
 * Releases the specific version
 * @param  {String} version The version to release
 */
Release.prototype.version = function (version, cb) {
  cb = cb || function(){};

  if (!version || version === true) {
    this.paramError('version');
  }

  this.version = version;

  async.map(this.channels, this.runSyncMethod('setVersion', version), cb);

};

Release.prototype.runSyncMethod = function(method) {
  var args = [].slice.call(arguments,1);
  return function(channel, cb) {
    this.debug('Running %s on %s with %s argument(s)', method, channel.getName(), args.length);
    channel[method].apply(channel, args);
    cb();
  }.bind(this);
};


/**
 * Returns the current version.
 *   Asks each channel to get version and raises an exception if versions conflict.
 * @param  {String} channel    Used to specify just one release channel to ask for version.
 * @param  {Array} options
 * @return {String} version
 */
Release.prototype.getVersion = function (defaultVersion) {

  var currentVersion = this._getVersion(true) || this._getVersion(false) || defaultVersion;

  if(!currentVersion) {
    return this.exit('Unable to determine current version.');
  }

  this.log(chalk.gray('Current version is: ') + chalk.bold.cyan(currentVersion));

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
Release.prototype._getVersion = function (strict) {
  if(strict === undefined) {
    strict = true;
  }

  var currentVersion;

  for (var channel in this.channels) {
    var currentVersionTmp = this.channels[channel].getVersion(strict);

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

Release.prototype.log = function (msg) {
  if( this.options.displayOutput) {
    return console.log('  ' + msg);
  }
};

/**
 * Displays an error by joining the paramaters.
 */
Release.prototype.error = function (fmt) {
  if(fmt instanceof Error) {
    fmt = fmt.stack || fmt.message;
  }
  fmt = '  Error: ' + fmt;
  var args = [].slice.call(arguments,0);
  args.unshift('  Error: ');
  process.stdout.write(chalk.styles.red[0] + chalk.styles.bold[0]);
  console.error.apply(this, args);
  process.stdout.write(chalk.styles.bold[1] + chalk.styles.red[1]);
};


/**
 * Wrapper around exit for missing paramaters.
 * @param  {String} param The paramater that is missing.
 */
Release.prototype.paramError = function(param) {
  return this.exit('No ' + chalk.bold(param) + ' parameter provided.');
};

Release.prototype.exit = function() {
  this.error.apply(this, arguments);
  process.exit(-1);
};
