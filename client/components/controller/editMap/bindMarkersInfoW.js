module.exports = {    
    bindMarkersInfoW: (markers, infowindows, map)=>{
        for(let i = 0; i < markers.length; i++) {
            markers[i].addListener('click', function(){
            infowindows[i].open(map, markers[i]);
            })
        };
        return markers;
    }
}