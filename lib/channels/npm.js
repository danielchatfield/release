/*
 * npm release implementation
 *
 * Copyright (c) 2013 Daniel Chatfield
 * Licensed under the MIT license.
 */
'use-strict';
var util = require('util');
var BaseRelease = require('base-release');

var Channel = module.exports;

function Channel() {
    BaseRelease.apply(this, arguments);
}

util.inherits( Channel, BaseRelease );