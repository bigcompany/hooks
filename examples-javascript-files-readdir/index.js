module['exports'] = function readdir (hook) {
  hook.fs.readdir('', function (err, files) {
    if (err){ 
      return res.end(err.message);
    }
    hook.res.json(files);
  });
};