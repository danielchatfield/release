/*
 * release
 * https://github.com/danielchatfield/release
 *
 * Copyright (c) 2013 Daniel Chatfield
 * Licensed under the MIT license.
 */

'use strict';

var release = module.exports = function release(version, options) {
    version = version || 'patch';
    options = options || {};
};

release.prototype.test = function test() {
    return true;
};