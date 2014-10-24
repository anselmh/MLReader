var pageMod = require("sdk/page-mod");
var self = require("sdk/self");

pageMod.PageMod({
  include: [
    'http://lists.w3.org/*',
    'https://lists.w3.org/*',
    'http://lists.whatwg.org/*',
    'https://lists.whatwg.org/*'
  ],
  contentScript: [
    self.data.url('./marked'),
    self.data.url('./mlr-inject'),
    'window.alert("JHo");'
  ],
  contentStyle: self.data.url('./mlr-style.css');
});
