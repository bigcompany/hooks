// Connect two Hooks together using .pipe()
module['exports'] = function pipeHook (hook) {
  // hook.open will create a stream to the echo hook
  // hook.open is for convience. Any stream will work.
  var stream = hook.open('https://hook.io/Marak/helloWorld');
  // Once we have created a stream to helloWorld,
  // pipe that stream to the client.
  // This techinque can be used on any streaming interace
  stream.pipe(hook.res);
};