// compiled using online babel
// https://airbnb.io/enzyme/docs/guides/jsdom.html
const { JSDOM } = require('jsdom');

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src).filter(prop => typeof target[prop] === 'undefined').reduce((result, prop) => _extends({}, result, {
    [prop]: Object.getOwnPropertyDescriptor(src, prop)
  }), {});
  Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js'
};
copyProps(window, global);