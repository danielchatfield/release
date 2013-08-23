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

Npm.prototype.isRoot = function () {
	return this.exists('package.json');
};

Npm.prototype.currentVersion = function () {
	var pkg = this.load('package.json');
	return pkg.version;
}