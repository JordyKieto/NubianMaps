var GoogleMapsLoader = require('google-maps');
GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
var {AdminListView} = require("../adminForms")
var styles = require("../../css/styles");
var Controller = require("./controller")

class AdminMap extends React.Component {
    // creates a map with autocomplete search bar
    async componentDidMount() {
        GoogleMapsLoader.KEY = await Controller.getMapsKey()
        var newsfeed = document.getElementById("newsfeed")
        newsfeed.style = "visibility:hidden"
        GoogleMapsLoader.load(function(google)  {
            var map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 43.642567, lng: -79.387054},
                zoom: 13
            });
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
};

    render() {
        return (
        <div id="mapdiv">

        <div id="map" style={styles.map}></div>

        <div id="infowindow-content">
        </div>

        <input id="pac-input" className="controls" type="text" style={styles.controls}
        placeholder="Enter a location"/>
        <AdminListView/>
        </div>
         //   React.createElement("div", {id: "map", style: mapStyle},
         //   React.createElement("input", {id: "pac-input", type: "text", placeholder: "Enter a location"})
          //  )
        )
    }
}

module.exports = AdminMap;