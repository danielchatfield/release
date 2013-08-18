/*
 * base release package implementation
 *
 * Copyright (c) 2013 Daniel Chatfield
 * Licensed under the MIT license.
 */
'use-strict';

var fs = require('fs');
var path = require('path');

var BasePackage = module.exports;

BasePackage = function BasePackage() {
    
};

BasePackage.depthLimit = 20;


BasePackage.prototype.exists = function () {
    var filePath = path.join.apply(null, arguments);
    return fs.existsSync(filePath);
};

/**
 * Determinies whether `dir` is the root directory.
 * @param  dir
 * @return {Boolean}
 */
BasePackage.prototype.isRoot = function (dir) {
    return this.exists(dir, 'release.json');
};