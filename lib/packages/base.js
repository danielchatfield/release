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

/**
 * Determines whether filepath exists
 *  Automatically joins all args
 * @return {Boolean}
 */
BasePackage.prototype.exists = function () {
    if (arguments.length === 0) {
        throw new Error("No argument supplied to exists(), at least 1 argument required.");
    }
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

/**
 * Starts at the specified directory (or the current working directory) and works its way up the file structure to find the root directory.
 * @param  {string} dir
 * @return {string} rootDir
 */
BasePackage.prototype.getRoot = function (dir) {
    dir = dir || process.cwd();

    if(this.rootDir) { //already been resolved
        return this.rootDir;
    }

    if (this.isRoot(dir)) {
        this.isPackage = true;
        this.rootDir = dir;
        return dir;
    }

    if( dir === path.resolve('/')) {
        // Cannot go any further
        this.isPackage = false;
        return null;
    }

    return this.getRoot(path.join(dir,'..'));
};