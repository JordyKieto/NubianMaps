var GoogleMapsLoader = require('google-maps');
GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
// call initMap before other methods to retrive mapsKey
const Controller = {
    getMapsKey : ()=>{
                var promise = new Promise((resolve, reject)=>{
                fetch("/api/mapsKey").then((response)=>{response.json().then((data) =>{resolve(data)})});
                        });
                return promise;
    },
    print:(value) => {console.log(value); return value},
    initMap    :async (lat, lng)=>{
                GoogleMapsLoader.KEY = await Controller.getMapsKey();
                var promise = new Promise((resolve, reject)=>{
                GoogleMapsLoader.load(function(google)  {
                    var map = new google.maps.Map(document.getElementById('map'), {
                    center: {lat: lat || 43.642567, lng: lng || -79.387054},
                    zoom: 13
                }); resolve(map)
                    });
                }); return promise;
    },
    getBusinesses:(category)=>{
                var promise = new Promise((resolve, reject)=>{
                fetch("/api/businesses?category=" + category).then((response)=>{
                    response.json().then((allBusinesses)=>{
                        resolve(allBusinesses)});
                    });
                }); return promise;
    },
    visibleNewsfeed:(status)=>{
                var newsfeed = document.getElementById("newsfeed");
                if(status){
                newsfeed.style = "visibility:visible";
                }
                else{newsfeed.style = "visibility:hidden"}
    },
    createCircle: (location, map)=>{
                GoogleMapsLoader.load(function(google)  {
                var circleOptions = {
                    fillColor: 'black',
                    fillOpacity: 0.50,
                    strokeColor: 'black',
                    strokeOpacity: 0.70,
                    strokeWeight: 1,
                    center: location,
                    radius: 200,
                };
                var circle = new google.maps.Circle(circleOptions);
                circle.setMap(map);
        });
    },
    createMarker: (location, map, infowindowContent)=>{
                var infowindow = new google.maps.InfoWindow();
                var marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    });
                marker.addListener('click', function(){
                    infowindow.open(map, marker);
                    });
            //   marker.setVisible(true);
                infowindow.setContent(infowindowContent);
                return {marker: marker, infowindow: infowindow}
    },
    getAllMarkers: ()=>{
        return myMarkers;
    },
    createPlaceImg: (place, map, infowindow, marker)=>{
                var placeImg = {};
                try {
                    placeImg.src = place.photos[0].getUrl({'maxWidth': 650, 'maxHeight': 650});
                }
                catch(err) {
                // no image for this place, setting default
                    placeImg.src = '../images/altLogo.png'
                }
                placeImg.id = place.name.replace(/ /, '-');
                placeImg.onmouseover = function(){
                    google.maps.event.trigger(marker, 'click');
                    map.setZoom(15);
                    map.panTo(place.geometry.location)
                };
                placeImg.onmouseout = function(){
                    map.setZoom(14);
                    map.panTo(place.geometry.location)                                    
                    infowindow.close();
                };
                return placeImg;
    },
    populateMap: async (allBusinesses, map, self)=>{
        // slight delay in loading markers
        // this is so we can wait for ALL markers
        // must be better of loading markers
                var imgArray = [];
                myMarkers = [];
                var bounds;
                for ( business of allBusinesses) {
                    var request = {placeId: business.placeID,fields: ['name', 'geometry', 'photos']}; 
                    var subPromise = new Promise((resolve, reject)=>{
                    GoogleMapsLoader.load(function(google){service = new google.maps.places.PlacesService(map);});
                    service.getDetails(request, populate);
                    async function populate(place, status) {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                                var infowindowContent = '<span class="infoTitle">' + place.name 
                                +'</span><br/><div style="height:43px">'
                                +'<form action="/api/favourites" method="post">'
                                +'<div style="width:100%;background-color:black" class="star">'
                                +'<button style="width:80px">'
                                +'<img src="../images/favourite.png" style="width:30px;height:30px"/></button>'
                                +'<span style="color:white;font-size:150%">  Nubian  </span>'
                                +'</div>'
                                +'<input name="id" type="hidden" value='+business._id+ ' />'
                                +'</form>'; 
                                var {marker, infowindow} = Controller.createMarker(place.geometry.location, map, infowindowContent);
                                var placeImg = Controller.createPlaceImg(place, map, infowindow, marker);

                                var lat = place.geometry.location.lat();
                                var lng = place.geometry.location.lng();
                                bounds = new google.maps.LatLngBounds();
                                bounds.extend(new google.maps.LatLng(lat, lng));

                                imgArray.push(placeImg);
                                self.setState({
                                imgArray: imgArray
                                });
                                myMarkers.push(marker);
                                resolve(marker)
                        }};  
                    });
                    await subPromise;
                }; 
                // outside for                    
                map.fitBounds(bounds);
                map.setZoom(13);
                console.log(myMarkers)
    },
    bindAutoComp: async (map)=>{
                GoogleMapsLoader.load(function(google)  {
                var input = document.getElementById('pac-input');

                var autocomplete = new google.maps.places.Autocomplete(input);
                autocomplete.bindTo('bounds', map);

                map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

                autocomplete.addListener('place_changed', async function(){
                    var place = autocomplete.getPlace();
                    // fills the infowindow with a form to add selected business
                    var infowindowContent = (place.name +'<br>'+ place.formatted_address +'<br><br>'
                    +'<form action="/api/businesses" method="POST">'
                    +'<input type="hidden" name="placeID" value='+place.place_id+'></input>'
                    +'<input type="hidden" name="name" value='+place.name+'></input>'
                    +'<input type="radio" name="category" value="entertainment">Entertainment</input><br></br>'
                    +'<input type="radio" name="category" value="networking">Networking</input><br></br>'
                    +'<input type="radio" name="category" value="food">Food</input><br></br>'
                    +'<input type="radio" name="category" value="cosmetics">Cosmetics</input><br></br>'
                    +'<input type="submit" value="Submit"></input>'
                    +'</form>');
                    var {marker, infowindow} = Controller.createMarker(place.geometry.location, map, infowindowContent);
                    
                    infowindow.close();
                    if (!place.geometry){
                        return;
                    }
                    if (place.geometry.viewport) {
                        map.fitBounds(place.geometry.viewport);
                    } else {
                        map.setCenter(place.geometry.location);
                        map.setZoom(17);
                    }
                    marker.setVisible(true);
                    infowindow.open(map, marker);
                });
            });
    },
    markMyLocation: (map)=>{
                var promise = new Promise((resolve, reject)=>{
                // this is called Asynchronously, we don't await it because we don't want
                // to hold up the queue for an event that might come at anytime
                if("geolocation" in navigator){
                    navigator.geolocation.getCurrentPosition(function(position) {
                        var infowindowContent = "You Are Here";
                        var location = {lat: position.coords.latitude, lng: position.coords.longitude}
                        var {marker} = Controller.createMarker(location, map, infowindowContent);
                        Controller.createCircle(location, map);
                        resolve(marker);
                    })
                } else {
                    //Geolocation is not available
                }
                }); return promise;
            },
};
module.exports = Controller;