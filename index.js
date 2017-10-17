//Import dependencies
var fs = require("fs");
var path = require("path");

//Remove async
var rmAsync = function(p, opt, cb)
{
  //Parse the callback
  cb = (typeof opt === 'function') ? opt : cb;

  //Parse the options object
  opt = (typeof opt === 'object') ? opt : {};

  //Check the parent option
  if(typeof opt.parent !== 'boolean'){ opt.parent = true; }

  //Get the stat of the path
  fs.stat(p, function(error, stat)
  {
    //Check the error
    if(error){ return next(error); }

    //Check if is a file
    if(stat.isFile() === true)
    {
      //Delete the file and call the callback method
      return fs.unlink(p, cb);
    }

    //Open the directory
    fs.readdir(p, function(error, list)
    {
      //Check for error
      if(error){ return cb(error); }

      //Delete all files
      var remove_child = function(index)
      {
        //Check the index
        if(index >= list.length)
        {
          //Check for remove the parent folder
          if(opt.parent === false)
          {
            //Call the callback without removing the parent folder
            return cb(null);
          }
          else
          {
            //Delete the parent folder
            return fs.rmdir(p, cb);
          }
        }

        //Remove the file or directory
        rmAsync(path.resolve(p, list[index]), { parent: true }, function(error)
        {
          //Check for error
          if(error){ return cb(error); }

          //Next item on the list
          return remove_child(index + 1);
        });
      };

      //Call the remove child recursive
      return remove_child(0);
    });
  });
};

//Remove a file/directory sync
var rmSync = function(p, opt)
{
  //Check the options
  if(typeof opt !== 'object'){ var opt = {}; }

  //Check the parent option
  if(typeof opt.parent !== 'boolean'){ opt.parent = true; }

  //Get the path stat
  var stat = pstat.StatSync(p);

  //Check for error
  if(stat === false){ return; }

  //Check if is a file
  if(stat.isFile() === true){ return fs.unlinkSync(p); }

  //Check if is not a directory
  if(stat.isDirectory() === false){ return; }

  //Get the folder content
  var list = fs.readdirSync(p);

  //Read the list
  for(var i = 0; i < list.length; i++)
  {
    //Get the full file path
    var file = path.resolve(p, list[i]);

    //Remove recursive
    rmSync(file, { parent: true });
  }

  //Check the parent folder
  if(opt.parent === false){ return; }

  //Remove the parent folder
  fs.rmdirSync(p);

  //Exit
  return;
};

//Remove a file or folder async
module.exports = rmAsync;

//Remove a file or folder sync
module.exports.sync = rmSync;
