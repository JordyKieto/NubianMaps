var Newsfeed = require("../newsfeed/newsfeed");
var GoogleMapsLoader = require('google-maps');
GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
var styles = require("../../css/styles");
var Controller = require("./controller")

class MainMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgArray: []
        }
    }
   
// displays various groups of businesses based on the URL param supplied in props
    componentDidMount() {
        Controller.getMapsKey().then((data)=>{ 
        GoogleMapsLoader.KEY = data; 
        var newsfeed = document.getElementById("newsfeed")
        newsfeed.style = "visibility:visible"
        var map;
        var imgArray = []        
        var self = this;
       

        fetch("/api/businesses?category=" + this.props.category).then(function(response){
                response.json().then(function(allBusinesses){
        
                allBusinesses.forEach(function(business, index, array) {
                    var request = {
                        placeId: business.placeID,
                        fields: ['name', 'geometry', 'photos']
                    };
                    if (!map){
                        GoogleMapsLoader.load(function(google)  {
                            map = new google.maps.Map(document.getElementById('map'), {
                            });
                        })
                        }
                    
                    GoogleMapsLoader.load(function(google)  {
                    
                    var bounds = new google.maps.LatLngBounds();
					var service = new google.maps.places.PlacesService(map);
					service.getDetails(request, callback);
					
                    function callback(place, status) {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                                var imgDiv = document.createElement("div");
                                var placeImg = {}
                                var newsfeed = document.getElementById("newsfeed");
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
       
    });
    });
});
};

    render() {
        return (
        <div>
        <div id ="map" style={styles.map} > </div>
        <Newsfeed imgArray={this.state.imgArray}/>
        </div>
        )
    }
};

module.exports = MainMap