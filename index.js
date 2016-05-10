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

      var _language = item.split('-')[1] || "javascript";

      /*
      var pkg =  {
        file: file,
        language: _language,
        source: fs.readFileSync(__dirname + "/" + item + "/" + file).toString()
      };
      */
      if (file === "package.json") {
        return;
      }

      var pkg = {
        "name": "marak/" + item,
        "version": "1.0.0",
        "description": "",
        "language": _language,
        "source": fs.readFileSync(__dirname + "/" + item + "/" + file).toString(),
        "main": file,
        "scripts": {
          "test": "echo \"Error: no test specified\" && exit 1"
        },
        "author": "Marak",
        "license": "MIT"
      }

      // auto-create package.json if missing
      var oldPkg;
      var exists = false;
      try {
        oldPkg = fs.readFileSync(__dirname + "/" + item + "/package.json").toString();
        oldPkg = JSON.parse(oldPkg);
        exists = true;
      } catch (err) {
        throw err;
        //oldPkg = pkg;
      }
      if(!exists) {
        //fs.writeFileSync(__dirname + "/" + item + "/package.json", JSON.stringify(pkg, true, 2));
      } else {
        pkg.description = oldPkg.description;
      }
      fs.writeFileSync(__dirname + "/" + item + "/package.json", JSON.stringify(pkg, true, 2));
      hooks.services[item] = pkg;
    });
  }
});
