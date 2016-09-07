module['exports'] = function mergeStreams (hook) {
  var ms = require('merge-stream');
  var stream1 = hook.open('https://hook.io/Marak/helloWorld');
  var stream2 = hook.open('https://hook.io/Marak/helloWorld');
  var merged = ms(stream1, stream2);
  // You can also add new streams later
  // merged.add(stream3);
  merged.on('data', function(chunk){
    hook.res.write(chunk.toString());
  });
  merged.on('end', function(){
   hook.res.end();
  });
};