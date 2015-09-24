// gateway hook for running microservices on hook.io in real-time without an account

// covers all JavaScript and Coffee-script

// example of deploying a js file to the hook.io cloud from the command line using cURL

// cat echo.js | curl --data-urlencode source@- http://gateway.hook.io

module['exports'] = function gatewayHook (hook) {

  var mschema = require('mschema');
  var params = hook.params;
  var source = params.source;
  var code;
  // try to compile the hot-code into a module
  try {
    // service is coffee-script, so convert it to javascript
    var CoffeeScript = require('coffee-script');
    code = CoffeeScript.compile(source);
    // brittle approach to remove coffee-script wrap,
    // we don't need / can't use the wrap as it was breaking our module['exports'] metaprogramming
    // TODO: better integration with generated JS
    code = code.split('\n');
    code.pop();
    code.pop();
    code.shift();
    // removes top and bottom generated lines
    code = code.join('\n')
  } catch (err) {
    hook.res.end("source code not parse! \n\n    " + err.message);
  }
  
  // try to compile the hot-code into a module
  try {
    var Module = module.constructor;
    var m = new Module();
    m.paths = module.paths;
    m._compile(code, 'hook.io-gateway');  
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