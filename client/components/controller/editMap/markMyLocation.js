module.exports = {
    markMyLocation: (myLocation, map)=>{
        let infowindowContent = 'You Are Here'  
        let infowindow = new window.google.maps.InfoWindow();
        infowindow.setContent(infowindowContent);
        let marker = new window.google.maps.Marker({
            position: myLocation,
            map: map,
            });
        marker.addListener('click', function(){
            infowindow.open(map, marker);
            });
        marker.addListener('dblclick', function(){
            map.panTo(marker.position);
            map.setZoom(16);
            });
        return marker;
    }
}