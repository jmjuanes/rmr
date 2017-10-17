//Import dependencies
var fs = require('fs');
var assert = require('assert');
var path = require('path');
var rmr = require('../index.js');

describe('rmr', function()
{
  it('should remove a file', function(done)
  {
    var file_path = path.join(__dirname, './remove-file.txt');
    fs.writeFileSync(file_path, 'File content', 'utf8');
    assert.equal(fs.existsSync(file_path), true);
    return rmr(file_path, function(error)
    {
      assert.equal(error, null);
      assert.equal(fs.existsSync(file_path), false);
      done();
    });
  });
  it('should remove a folder and all the contents', function(done)
  {
    done();
  });
});