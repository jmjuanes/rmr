//Import dependencies
var fs = require("fs");
var path = require("path");
var pstat = require('pstat');
var keue = require('keue');

//Remove async
var rmAsync = function(p, opt, cb)
{
  //Check the option
  if(typeof opt === 'function'){ var cb = opt; opt = {}; }

  //Check the parent option
  if(typeof opt.parent !== 'boolean'){ opt.parent = true; }

  //Initialize the new keue
  var k = new keue();

  //Check the path stat
  k.then(function(next)
  {
    //Get the stat of the path
    pstat.Stat(p, function(stat)
    {
      //Check for error
      if(stat === false){ return cb(null); }

      //Check if is a file
      if(stat.isFile() === true)
      {
        //Delete the file and exit
        return fs.unlink(p, function(){ return cb(null); });
      }

      //Continue
      return next();
    });

    //Exit keue callback
    return;
  });

  //Read all the files on the directory
  k.then(function(next)
  {
    //Open the directory
    fs.readdir(p, function(error, list)
    {
      //Check for error
      if(error){ return cb(error); }

      //Delete all files
      var remove_child = function(elements, index, callback)
      {
        //Check the index
        if(index >= elements.length){ return callback(null); }

        //Get the element to remove
        var el = elements[index];

        //Get the file path
        var file = path.resolve(p, el);

        //Remove the file or directory
        rmAsync(file, { parent: true }, function(error)
        {
          //Check for error
          if(error){ return callback(error); }

          //Next item on the list
          return remove_child(elements, index + 1, callback);
        });

        //Exit
        return;
      };

      //Call the remove child recursive
      remove_child(list, 0, function(error)
      {
        //Check for error
        if(error){ return cb(error); }

        //Check for remove the parent folder
        if(opt.parent === false){ return cb(null); }

        //Delete the folder
        fs.rmdir(p, function(e){ return cb(e); });

        //Exit
        return;
      });

      //Exit readdir callback
      return;
    });

    //Exit keue callback
    return;
  });

  //All done, exit
  k.then(function(){ return cb(null); });

  //Run the keue
  k.run();
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
