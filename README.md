# release
[![Build Status](https://secure.travis-ci.org/danielchatfield/release.png?branch=master)](http://travis-ci.org/danielchatfield/release)
[![Dependency Status](https://gemnasium.com/danielchatfield/release.png)](https://gemnasium.com/danielchatfield/release) 
[![NPM version](https://badge.fury.io/js/release.png)](http://badge.fury.io/js/release)

A small CLI to make releasing npm, bower, and PyPI components easy. Includes a plugin architecture for writing your own release channels.

## Getting Started
Install the module with: `npm install -g release`

```
$ release --patch
  [NPM] Bumping version number from 1.4.2 to 1.4.3
  [GIT] Tagging release [v1.4.3]
  [GIT] Pushing to danielchatfield/release
  [NPM] Publishing to 'release'

  Successfully released version 1.4.3
$
```


## Documentation


## Errors

### Can't bump non-semver version number
```
$ release --patch
  Error: version '1.4.2-rc1' is not semver compatible. You must explicitly set version: release --version 1.4.2-rc1
$
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Daniel Chatfield. Licensed under the MIT license.
