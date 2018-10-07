module.exports = {
    visibleNewsfeed:(status)=>{
        var newsfeed = document.getElementById("newsfeed");
        if(status){
        newsfeed.style = "visibility:visible";
        }
        else{newsfeed.style = "visibility:hidden"}
    }
}