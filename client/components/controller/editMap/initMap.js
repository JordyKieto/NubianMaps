const initMap = {
    initMap    :async (lat, lng)=>{
        var promise = new Promise((resolve, reject)=>{
            var map = new window.google.maps.Map(document.getElementById('map'), {
            center: {lat: lat || 43.642567, lng: lng || -79.387054},
            zoom: 13
            }); resolve(map)
        }); return promise;
    },
}

module.exports = initMap;