module['exports'] = function geoipHook (hook) {
  var geoip = require('geoip-lite');
  var ip = hook.params.ip;
  if (typeof ip === "undefined" || ip.length === 0) {
    ip = hook.req.headers['x-forwarded-for'];
  }
  console.log('attempting to lookup ' + ip);
  var geo = geoip.lookup(ip);
  if (geo === null) {
    return hook.res.end(JSON.stringify({ message: "invalid ip " + ip.toString(), error: true }, true, 2));
  }
  geo.ip = ip;
  return hook.res.end(JSON.stringify(geo, true, 2));
};

module['exports'].schema = {
  "ip": {
    "type": "string"
  }
};

module['exports'].view = "https://gist.githubusercontent.com/Marak/2585b2556386ffe1c31a/raw/view.html";
module['exports'].presenter = "https://gist.githubusercontent.com/Marak/2585b2556386ffe1c31a/raw/presenter.js";