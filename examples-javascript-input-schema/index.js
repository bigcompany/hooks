module['exports'] = function inputSchema (hook, callback) {
  // Responds back with incoming Hook parameters
  hook.res.end(JSON.stringify(hook.params, true, 2));
};
// Specify an optional schema object
// This enables validation and defaults for Hook input
// For complete documentation on available schema types,
// see: http://github.com/mschema/mschema
module['exports'].schema = {
  "name": {
    "type": "string",
    "default": "Bob",
    "required": false
  },
  "age": {
    "type": "number",
    "default": 40
  },
  "status": {
    "type": "string",
    "default": "active",
    "enum": ["active", "disabled"]
  },
  "isAlive": {
    "type": "boolean",
    "default": true
  }
};
