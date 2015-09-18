// gateway hook for running microservices on hook.io in real-time without an account

// example of deploying a js file to the hook.io cloud from the command line using cURL

// cat echo.js | curl --data-urlencode source@- http://gateway.hook.io

module['exports'] = function gatewayHook (hook) {
  
  var mschema = require('mschema');
  var params = hook.params;
  var source = params.source;
  console.log('azza');
  // try to compile the hot-code into a module
  try {
    var Module = module.constructor;
    var m = new Module();
    m.paths = module.paths;
    m._compile(source, 'hook.io-gateway');  
  } catch (err) {
    hook.res.end("No valid module['exports'] function was exported! \n\n    " + err.message);
  }

  // map incoming parameters, but don't include source code
  var props = {};
  for (p in params) {
    if (p !== 'source') {
      props[p] = params[p];
    }
  }

  // perform validation on input schema ( if it exists )
  var defaults = mschema.validate(props, m.exports.schema || {}, { strict: false });

  // normally validation is performed by the hook itself, but since we are inside
  // the gateway hook ( and doing a hot-code run inside an existing hook ),
  // we have to repeat some logic
  
  // In the future if we are going to add view-presenter pattern to hot-code,
  // or other hook processing code, we will need to refactor the hook resource,
  // so we don't end up duplicating more code
  if (defaults.valid === false) {
    return hook.res.end('Invalid data');
  }

  // map validated / defaulted data to params
  hook.params = defaults.instance;
  console.log(hook.params);
  
  m.exports(hook);
};