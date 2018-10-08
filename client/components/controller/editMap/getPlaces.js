const getPlaces = {
    getPlaces: async (businesses, map)=>{
        var promise = new Promise(async(resolve, reject)=>{
        // slight delay in loading markers
        // this is so we can wait for ALL markers
        // must be better of loading markers
                var imgArray = [];
                var myPlaces = [];
                var bounds;
                for (var i = 0; i <businesses.length; i++) {
                    var request = {placeId: businesses[i].placeID,fields: ['name', 'geometry', 'photos']}; 
                    var subPromise = new Promise((resolve, reject)=>{
                    var service = new window.google.maps.places.PlacesService(map);
                    service.getDetails(request, populate);
                    async function populate(place, status) {
                        if (status == window.google.maps.places.PlacesServiceStatus.OK) {
                                
                        //        var {marker, infowindow} = Controller.createMarker(place.geometry.location, map, infowindowContent);
                       //         var placeImg = Controller.createPlaceImg(place, map, infowindow, marker);

                        //        var lat = place.geometry.location.lat();
                        //        var lng = place.geometry.location.lng();
                        //        bounds = new window.google.maps.LatLngBounds();
                        //        bounds.extend(new window.google.maps.LatLng(lat, lng));
                            place.business = {};
                            place.business._id = businesses[i]._id;


                                myPlaces.push(place);
                                resolve(place)
                        }};  
                    });
                    await subPromise;
                }; 
                // outside for                    
            //    map.fitBounds(bounds);
            //    map.setZoom(13);
               // console.log(myPlaces)
                resolve(myPlaces)
            })
               return promise;
    },
}

module.exports = getPlaces;