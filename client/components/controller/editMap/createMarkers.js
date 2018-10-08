module.exports = {    
    createMarkers: (places, map)=>{
    let markers = [];
    for(let i = 0; i < places.length; i++) {
    let marker = new window.google.maps.Marker({
        position: places[i].geometry.location,
        map: map,
        });
    marker.addListener('dblclick', function(){
        map.panTo(marker.position);
        map.setZoom(16);
        });
    marker.setVisible(true);
    markers.push(marker);
    //return {marker: marker, infowindow: infowindow}
    };   
    return markers;
    },
}