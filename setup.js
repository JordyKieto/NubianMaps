// compiled using online babel
// https://airbnb.io/enzyme/docs/guides/jsdom.html
const { JSDOM } = require('jsdom');
var tough = require('tough-cookie');



var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const jsdom = new JSDOM(`<!doctype html><head>
</head><body><div id="map" style="width:100%;height:800px"></div></body></html>`, {
  url: 'http://localhost:8080/',
  contentType: "text/html",
  includeNodeLocations: true,
  storageQuota: 10000000,
  origin: 'http://localhost:8080/',
  baseURI: 'http://localhost:8080/',
  referrer: 'http://localhost:8080/',
  pretendToBeVisual: true
});
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src).filter(prop => typeof target[prop] === 'undefined').reduce((result, prop) => _extends({}, result, {
    [prop]: Object.getOwnPropertyDescriptor(src, prop)
  }), {});
  Object.defineProperties(target, props);
}

jsdom.raise = function (type, message, data) {
  if (data.error) {
      throw data.error;
  } else {
      console.error('ERROR', message);
  }
};

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js'
};
copyProps(window, global);