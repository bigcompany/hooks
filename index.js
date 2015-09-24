var hooks = {};
module['exports'] = hooks;
hooks.services = {};

var fs = require('fs');

var dir = fs.readdirSync(__dirname);

// filter directories for any known non-service folders
dir = dir.filter(function(item){
  if ([".git", "node_modules"].indexOf(item) === -1) {
    return true;
  }
});

dir.forEach(function (item) {
  var stat = fs.statSync(__dirname + "/" + item);
  // only consider folders possible services
  if (stat.isDirectory()) {
    // assume directory is a service, 
    // load all its subfiles as a strings
    hooks.services[item] = {};
    var files = fs.readdirSync(__dirname + "/" + item);
    files.forEach(function(file){
      // quick hack
      var _language = item.split('-')[1];
      hooks.services[item] = {
        file: file,
        language: _language,
        source: fs.readFileSync(__dirname + "/" + item + "/" + file).toString()
      };
    });
  }
});
