var styles = require("../../css/styles");

function Newsfeed(props) {
    var Feed = props.imgArray.map(function (feedItem) {
        return (<div style={styles.imgDiv} className="imgDiv" key={`div ${feedItem.id}`}>
                    <img id={feedItem.id.concat('-feedImg')} className="feedItem" 
                        style={styles.placeImg} src={feedItem.src} onMouseOver={feedItem.onmouseover} 
                        onMouseOut= {feedItem.onmouseout} key={`${feedItem.id}`}/>
                </div>
                )});
                                            
    return (
        <div id="newsfeed"> 
        {Feed}
        </div>
    )
};


module.exports = Newsfeed