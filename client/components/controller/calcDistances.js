module.exports = {
    calcDistances: async(origin, destinations)=>{
        document.domain = "localhost";
        console.log(document.referrer);
        for(destination of destinations){
                console.log(`You are ${window.google.maps.geometry.spherical.computeDistanceBetween(origin.position, destination.position)} metres away from...`);
        }
    }
}