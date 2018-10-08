module.exports = {
    bindAutoComp: async (map)=>{
        var input = document.getElementById('pac-input');

        var autocomplete = new window.google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);

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
        return autocomplete;
},
}