var styles = require("../../css/styles");

function Newsfeed(props) {
    var feed = props.imgArray.map(function (feedItem) {
        return React.createElement("div", {style: styles.imgDiv, className: "imgDiv"}, 
                    React.createElement("img", {id: feedItem.id.concat('-feedImg'), className: "feedItem", 
                    style: styles.placeImg, src: feedItem.src, onMouseOver: feedItem.onmouseover, 
                    onMouseOut: feedItem.onmouseout})
                        )});
                                            
    return (
        React.createElement("div", {id: "newsfeed"}, feed)
    )
};
module.exports = Newsfeed