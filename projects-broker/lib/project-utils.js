'use strict';

var exec = require('child_process').exec;

module.exports = {

  /*
  cmd: Command to run, with space-separated arguments, example: /bin/bash /var/lib/forj/newproject.sh foo
  callback(error, stdout, stderr):
    On success: error will be null.
    On error: error.code will be the exit code
  */

  createProject: function(cmd, callback){
    exec(cmd, function (error, stdout, stderr) {
      callback(error, stdout, stderr);
    });
  }
};