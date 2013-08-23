/*
 * npm release implementation
 *
 * Copyright (c) 2013 Daniel Chatfield
 * Licensed under the MIT license.
 */
'use-strict';
var util = require('util');
var BaseChannel = require('release-channel');

module.exports = Npm;

function Npm() {
    return BaseChannel.apply(this, arguments);
}

util.inherits( Npm, BaseChannel );

Npm.prototype._isRoot = function () {
	return this.exists('package.json');
};

Npm.prototype._getVersion = function () {
	var pkg = this.readJSON('package.json');
	return pkg.version;
};

Npm.prototype._setVersion = function (version) {
	var pkg = this.readJSON('package.json');
	pkg.version = version;
	this.writeJSON('package.json', pkg);
};