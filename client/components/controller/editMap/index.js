var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
const getPlaces = require('./getPlaces');
const initMap = require('./initMap');
const createCircle = require('./createCircle');
const createMarkers = require('./createMarkers');
const getMyLocation = require('./getMyLocation');
const markMyLocation = require('./markMyLocation');
const createFavInfoWs = require('./createFavInfoWs');
const bindMarkersInfoW = require('./bindMarkersInfoW')
const createVoteWindows = require('./createVoteWindows')

const editMap = _extends({}, 
    createMarkers, 
    getMyLocation, 
    markMyLocation,
    createFavInfoWs,
    createVoteWindows,
    bindMarkersInfoW, 
    createCircle, 
    initMap, 
    getPlaces
);

module.exports = editMap;