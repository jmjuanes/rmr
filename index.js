//Import dependencies
var fs = require("fs");
var path = require("path");
var pstat = require('pstat');

//Remove async
var rmAsync = function(p, opt, cb)
{
  //Check the option
  if(typeof opt === 'function'){ var cb = opt; opt = {}; }

  //Check the parent option
  if(typeof opt.parent !== 'boolean'){ opt.parent = true; }

  //Get the stat of the path
  pstat.Stat(p, function(stat)
  {
    //Check for error
    if(stat === false){ return cb(false); }

    //Check if is a file
    if(stat.isFile() === true)
    {
      //Delete the file and exit
      return fs.unlink(p, function(){ return cb(true); });
    }

    //Check if is not a directory
    if(stat.isDirectory() === false){ return cb(false); }

    //Open the directory
    fs.readdir(p, function(error, list)
    {
      //Check for error
      if(error){ return cb(false); }

      //Number of files
      var num = list.length;

      //Check the number
      if(num === 0){ return fs.rmdir(p, function(){ return cb(true); }); }

      //For each element on the list
      list.forEach(function(el)
      {
        //Get the file path
        var file = path.resolve(p, el);

        //Remove the file or directory
        rmAsync(file, { parent: true }, function()
        {
          //Remove one from the list
          num = num - 1;

          //Check the number
          if(num !== 0){ return; }

          //Delete the folder
          fs.rmdir(p, function(){ return cb(true); });
        });

        //Continue
        return true;
      });
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

	//Remove the parent folder
	fs.rmdirSync(p);

  //Exit
  return;
};

//Remove a file or folder async
module.exports = rmAsync;

//Remove a file or folder sync
module.exports.sync = rmSync;
