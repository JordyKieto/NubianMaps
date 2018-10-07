module.exports = {    
    createMarkers: (places, map)=>{
    let markers = [];
    let infoWindows = [];
    for(let i = 0; i < places.length; i++) {
        let infowindowContent = '<span class="infoTitle">' + places[i].name 
        +'</span><br/><div style="height:43px">'
        +'<form action="/api/favourites" method="post">'
        +'<div style="width:100%;background-color:black" class="star">'
        +'<button style="width:80px">'
        +'<img src="../images/favourite.png" style="width:30px;height:30px"/></button>'
        +'<span style="color:white;font-size:150%">  Nubian  </span>'
        +'</div>'
        +'<input name="id" type="hidden" value='+places[i].business._id+ ' />'
        +'</form>';    
    let infowindow = new window.google.maps.InfoWindow();
    infowindow.setContent(infowindowContent);
    let marker = new window.google.maps.Marker({
        position: places[i].geometry.location,
        map: map,
        });
    marker.addListener('click', function(){
        infowindow.open(map, marker);
        });
    marker.addListener('dblclick', function(){
        map.panTo(marker.position);
        map.setZoom(16);
        });
    marker.setVisible(true);
    markers.push(marker);
    infoWindows.push(infowindow);
    //return {marker: marker, infowindow: infowindow}
    };   
    return {markers: markers, infoWindows: infoWindows};},}