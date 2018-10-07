module.exports = {
    getMyLocation: (map)=>{
        var promise = new Promise((resolve, reject)=>{
        // this is called Asynchronously, we don't await it because we don't want
        // to hold up the queue for an event that might come at anytime
        if("geolocation" in navigator){
            navigator.geolocation.getCurrentPosition(function(position) {
                //var infowindowContent = "You Are Here";
                var location = {lat: position.coords.latitude, lng: position.coords.longitude}
                //var {marker} = Controller.createMarker(location, map, infowindowContent);
                //Controller.createCircle(location, map);
                resolve(location);
            })
        } else {
            //Geolocation is not available
            resolve('no geo');
        }
        }); return promise;
    }
}