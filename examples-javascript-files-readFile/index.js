module['exports'] = function readFile (hook) {
  hook.fs.readFile('testing-file.txt', function (err, file) {
    if (err){ 
      return res.end(err.message);
    }
    hook.res.json(file);
  });
};