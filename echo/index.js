module['exports'] = function echoHttp (hook) {

  console.log("Console messages are sent to /logs");

  console.log(hook.params);

  console.log(hook.req.path);

  console.log(hook.req.method);
  
  console.log(hook.env);

  hook.res.end(JSON.stringify(hook.params, true, 2));

};

// Remark: Using a schema is *completely* optional! 
// You *can* pass abritrary parameters without using a schema
// For Example: curl http://echo.hook.io?foo=bar
module['exports'].schema = {
  "param1": {
    "type": "string",
    "default": "foo"
  },
  "param2": {
    "type": "string",
    "default": "bar"
  }
};