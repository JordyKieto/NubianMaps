var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
const fetch = require('isomorphic-fetch');
const host = process.env.CURRENT_DOMAIN || "" ;
const setupGoogle = require('./setupGoogle');
const accessApi = require('./accessApi');
const editMap = require('./editMap');
const bindAutoComp = require('./bindAutoComp');
const createPlaceImgs = require('./createPlaceImgs');
const visibleNewsfeed = require('./visibleNewsfeed');
const calcDistances = require('./calcDistances')
var google;

// call initMap before other methods to retrive mapsKey
const Controller = _extends({}, 
    setupGoogle, 
    accessApi, 
    editMap, 
    visibleNewsfeed, 
    createPlaceImgs, 
    bindAutoComp, 
    calcDistances
);
module.exports = Controller;