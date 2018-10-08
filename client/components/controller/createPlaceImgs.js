
module.exports = {
    createPlaceImgs: (places, map, infowindows, markers, self)=>{
    let imgArray = [];    
    for(let i = 0; i < places.length ; i++){
        let placeImg = {};
        try {
            placeImg.src = places[i].photos[0].getUrl({'maxWidth': 650, 'maxHeight': 650});
        }
        catch(err) {
        // no image for this place, setting default
            placeImg.src = '../images/altLogo.png'
        }
        placeImg.id = places[i].name.replace(/ /, '-');
        placeImg.onmouseover = function(){
            window.google.maps.event.trigger(markers[i], 'click');
            map.setZoom(15);
            map.panTo(places[i].geometry.location);
            infowindows[i].open(map, markers[i]);
        };
        placeImg.onmouseout = function(){
            map.setZoom(14);
            map.panTo(places[i].geometry.location);                                    
            infowindows[i].close(map, markers[i]);
        };
    // return placeImg;
        imgArray.push(placeImg);
  };
    self.setState({
        imgArray: imgArray
    });
}}