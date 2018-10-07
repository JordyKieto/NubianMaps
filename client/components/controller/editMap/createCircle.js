module.exports = {createCircle: (location, map)=>{
    var circleOptions = {
        fillColor: 'black',
        fillOpacity: 0.50,
        strokeColor: 'black',
        strokeOpacity: 0.70,
        strokeWeight: 1,
        center: location,
        radius: 200,
    };
    var circle = new window.google.maps.Circle(circleOptions);
    circle.setMap(map);
}}