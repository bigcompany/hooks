// gateway hook for running es7 microservices on hook.io in real-time without an account

// covers all JavaScript and Coffee-script

// example of deploying a js file to the hook.io cloud from the command line using cURL

// cat echo.js | curl --data-urlencode source@- http://gateway.hook.io

module['exports'] = function gatewayHook (hook) {

  var mschema = require('mschema');
  var params = hook.params;
  var source = params.source;
  var code = params.source;
  // try to compile the hot-code into a module
      var babel = require('babel-core');
    require("babel-polyfill");

  try {
    // service is es6+, so convert it to normal javascript
    // TODO: This may cause peformance issues, could be better to cache transpile of code
    var opts = {
      "presets": [
       "es2015",
       "stage-3"
      ],
      "plugins": ["syntax-async-functions","transform-regenerator"]
    };
    //console.log(code)

    code = babel.transform(code, opts).code;
    // brittle approach to wrap es7 in module.exports
    // TODO: better integration with generated JS
    code = code.split('\n');
    code.shift();
    code.shift();
    code = code.join('\n');
    code = 'var exports = module["exports"];\n\n' + code;
  } catch (err) {
    hook.res.end("source code not parse! \n\n    " + err.message);
  }
  //hook.res.end(code);
  //return;
  // try to compile the hot-code into a module
    var Module = module.constructor;
    var m = new Module();
    m.paths = module.paths;
    m._compile(code, 'hook.io-gateway');  
   //var m = new Function(code);
  // map incoming parameters, but don't include source code
  var props = {};
  for (p in params) {
    if (p !== 'source') {
      props[p] = params[p];
    }
  }

  // perform validation on input schema ( if it exists )
  //var defaults = mschema.validate(props, m.exports.schema || {}, { strict: false });
  var defaults = {};
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
  //console.log(hook.params);
  //hook.res.json(m);
  //console.log(m.exports)
  //m(hook)
  m.exports.default(hook);
};