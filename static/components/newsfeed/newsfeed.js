var styles = require("../../css/styles");

function Newsfeed(props) {
    var Feed = props.imgArray.map(function (feedItem) {
        return (<div style={styles.imgDiv} className="imgDiv">
                    <img id={feedItem.id.concat('-feedImg')} className="feedItem" 
                        style={styles.placeImg} src={feedItem.src} onMouseOver={feedItem.onmouseover} 
                        onMouseOut= {feedItem.onmouseout}/>
                </div>
                )});
                                            
    return (
        <div id="newsfeed"> 
        {Feed}
        </div>
    )
};


module.exports = Newsfeed