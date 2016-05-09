module['exports'] = function statFile (hook) {
  hook.fs.stat('testing-file.txt', function (err, stat) {
    if (err){ 
      return res.end(err.message);
    }
    hook.res.json(stat);
  });
};