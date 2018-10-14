module.exports = {    
    createFavInfoWs: (places)=>{
        return places.map(place =>{
            let infowindowContent = '<span class="infoTitle">' + place.name 
            +'</span><br/><div style="height:43px">'
            +'<form action="/api/favourites" method="post">'
            +'<div class="favText"style="width:100%;background-color:black" class="star">'
            +'<span style="color:white;font-size:120%;position:absolute:top:15px">Add To Favourites +</span>'
            +'<button style="width:80px">'
            +'<img src="../images/favourite.png" style="width:30px;height:30px"/></button>'
            +'<span style="color:white;font-size:150%">  Nubian  </span>'
            +'</div>'
            +'<input name="id" type="hidden" value='+place.business._id+ ' />'
            +'</form>';    
            let infowindow = new window.google.maps.InfoWindow();
            infowindow.setContent(infowindowContent);
            return infowindow;
        });
    }
}