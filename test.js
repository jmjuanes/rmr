//Import rmr
var rmr = require('./index.js');

//Remove the test folder
rmr('./test', function(error)
{
  //Check the error
  if(error){ return console.error(error); }

  //Display done
  return console.log('Folder removed');
});
