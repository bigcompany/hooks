// Access incoming HTTP request data
module['exports'] = function accessRequestData (hook) {
  var params = hook.params;
  // params contains all incoming request parameters,
  // such as query string or form data.
  // See http://hook.io/docs#data for more information
  // Responds back with all incoming HTTP params
  hook.res.write(JSON.stringify(hook.params, true, 2));
  hook.res.end();
};