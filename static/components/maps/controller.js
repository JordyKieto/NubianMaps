var GoogleMapsLoader = require('google-maps');
GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
// call getMapsKey before using GoogleMapsLoader
const Controller = {
    getMapsKey : ()=>{
                var promise = new Promise((resolve, reject)=>{
                fetch("/api/mapsKey").then((response)=>{response.json().then((data) =>{resolve(data)})});
                        });
                return promise;
    },
    initMap    :async (lat, lng)=>{
                GoogleMapsLoader.KEY = await Controller.getMapsKey();
                var promise = new Promise((resolve, reject)=>{
                GoogleMapsLoader.load(function(google)  {
                    var map = new google.maps.Map(document.getElementById('map'), {
                    center: {lat: lat, lng: lng},
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
    populateMap: async (allBusinesses, map, self)=>{
                GoogleMapsLoader.KEY = await Controller.getMapsKey();    
                var imgArray = [];
                allBusinesses.forEach(function(business, index, array) {
                    var request = {
                        placeId: business.placeID,
                        fields: ['name', 'geometry', 'photos']
                    };      
                    GoogleMapsLoader.load(function(google)  {
                    
                    var bounds = new google.maps.LatLngBounds();
                    var service = new google.maps.places.PlacesService(map);
                    service.getDetails(request, callback);
                    
                    function callback(place, status) {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                                var imgDiv = document.createElement("div");
                                var placeImg = {}
                                try {
                                    placeImg.src = place.photos[0].getUrl({'maxWidth': 650, 'maxHeight': 650});
                                }
                                catch(err) {
                                // no image for this place, setting default
                                    placeImg.src = '../images/altLogo.png'
                                }
                                var name = place.name
                                placeImg.id = name.replace(/ /, '-');
                                
                                var lat = place.geometry.location.lat()
                                var lng = place.geometry.location.lng()

                                var marker = new google.maps.Marker({
                                position: place.geometry.location,
                                map: map,
                                });
                                var infowindow = new google.maps.InfoWindow({
                                content: ('<span class="infoTitle">' + place.name + '</span><br/><div style="height:43px">'
                                +'<form action="/api/favourites" method="post">'
                                +'<button style="width:80%" class="star"><img src="../images/favourite.png" style="width:30px;height:30px"/></button>'
                                +'<input name="id" type="hidden" value='+business._id+ ' />'
                                +'</form>'
                                )});
                                marker.addListener('click', function(){
                                infowindow.open(map, marker);
                                });
                                bounds.extend(new google.maps.LatLng(lat, lng));
                                
                                placeImg.onmouseover = function(){
                                    google.maps.event.trigger(marker, 'click');
                                    map.setZoom(15);
                                    map.panTo(place.geometry.location)
                                };
                                placeImg.onmouseout = function(){
                                    map.setZoom(14);
                                    map.panTo(place.geometry.location)                                    
                                    infowindow.close();};
                                imgArray.push(placeImg);
                                (() => {
                                    self.setState({
                                    imgArray: imgArray
                                })
                            })()
                            
                        }
                            map.fitBounds(bounds)
                            map.setZoom(13)
                    };
                });
            });
    },
    bindAutoComp: async (map)=>{
                GoogleMapsLoader.KEY = await Controller.getMapsKey();    
                GoogleMapsLoader.load(function(google)  {
                var input = document.getElementById('pac-input');

                var autocomplete = new google.maps.places.Autocomplete(input);
                autocomplete.bindTo('bounds', map);

                map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

                var infowindow = new google.maps.InfoWindow();
                var marker = new google.maps.Marker({
                    map: map
                });
                marker.addListener('click', function(){
                    infowindow.open(map, marker);
                })

                autocomplete.addListener('place_changed', function(){
                    infowindow.close();
                    var place = autocomplete.getPlace();
                    if (!place.geometry){
                        return;
                    }

                    if (place.geometry.viewport) {
                        map.fitBounds(place.geometry.viewport);
                    } else {
                        map.setCenter(place.geometry.location);
                        map.setZoom(17);
                    }

                    marker.setPlace({
                        placeId: place.place_id,
                        location: place.geometry.location
                    });
                    marker.setVisible(true);
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
                    +'</form>')
                    infowindow.setContent(infowindowContent);
                    infowindow.open(map, marker)
                });
            });
    },
};
module.exports = Controller;