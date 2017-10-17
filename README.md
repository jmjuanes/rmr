# rmr

> Remove all files or directories from a path recursively

[![npm](https://img.shields.io/npm/v/rmr.svg?style=flat-square)](https://www.npmjs.com/package/rmr)
[![npm](https://img.shields.io/npm/dt/rmr.svg?style=flat-square)](https://www.npmjs.com/package/rmr)


## Install

You can install the latest version of the package using **npm**:

```
$ npm install --save rmr
```

## Usage

```javascript
//Import package
var rmr = require('rmr');

//Remove a file
rmr('./your/path/file.txt', function(error){ console.log('file.txt removed'); });

//Remove a directory recursive
rmr('./your/path/folder/', function(error){ console.log('folder removed'); });

//Synchronous version
rmr.sync('./your/path/file.txt');

//Synchronous version
rmr.sync('./your/path/folder/');
```

## API

### rmr(path, callback)

Remove a file or directory recursively.

### rmr.sync(path)

Synchronously remove a file or directory recursively.


## License

[MIT](./LICENSE) &copy; Josemi Juanes.
