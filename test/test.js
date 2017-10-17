//Import dependencies
var fs = require('fs');
var assert = require('assert');
var path = require('path');
var rmr = require('../index.js');

describe('rmr', function()
{
  it('should remove a file', function(done)
  {
    var file_path = path.join(__dirname, './remove-file-1.txt');
    fs.writeFileSync(file_path, 'File content', 'utf8');
    assert.equal(fs.existsSync(file_path), true);
    return rmr(file_path, function(error)
    {
      assert.equal(error, null);
      assert.equal(fs.existsSync(file_path), false);
      done();
    });
  });

  it('should not trow an error if path does not exists', function(done)
  {
    var file_path = path.join(__dirname, './remove-file-2.txt');
    assert.equal(fs.existsSync(file_path), false);
    return rmr(file_path, function(error)
    {
      assert.equal(error, null);
      assert.equal(fs.existsSync(file_path), false);
      done();
    });
  });

  it('should remove a folder and all the contents', function(done)
  {
    var folder1_path = path.join(__dirname, './folder1/');
    var folder2_path = path.join(folder1_path, './folder2/');
    var folder3_path = path.join(folder1_path, './folder3/');
    var file1_path = path.join(folder1_path, './file1.txt');
    var file2_path = path.join(folder1_path, './file2.txt');
    var file3_path = path.join(folder2_path, './file3.txt');
    fs.mkdirSync(folder1_path);
    fs.mkdirSync(folder2_path);
    fs.mkdirSync(folder3_path);
    fs.writeFileSync(file1_path, 'Content', 'utf8');
    fs.writeFileSync(file2_path, 'Content', 'utf8');
    fs.writeFileSync(file3_path, 'Content', 'utf8');
    assert.equal(fs.existsSync(folder1_path), true);
    assert.equal(fs.existsSync(folder2_path), true);
    assert.equal(fs.existsSync(folder3_path), true);
    assert.equal(fs.existsSync(file1_path), true);
    assert.equal(fs.existsSync(file2_path), true);
    assert.equal(fs.existsSync(file3_path), true);
    return rmr(folder1_path, function(error)
    {
      assert.equal(error, null);
      assert.equal(fs.existsSync(folder1_path), false);
      return done();
    });
  });
});