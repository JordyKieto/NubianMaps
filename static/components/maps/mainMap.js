var Newsfeed = require("../newsfeed/newsfeed");
var GoogleMapsLoader = require('google-maps');
GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
var styles = require("../../css/styles");
var Controller = require("./controller")

class MainMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgArray: []
        }
    }
   
// displays various groups of businesses based on the URL param supplied in props
    async componentDidMount() {
        var self = this;
        GoogleMapsLoader.KEY = await Controller.getMapsKey();
        var map = await Controller.initMap(GoogleMapsLoader);
        var allBusinesses = await Controller.getBusinesses(this.props.category);
        Controller.visibleNewsfeed();
        Controller.populateMap(allBusinesses, GoogleMapsLoader, map, self);

};

    render() {
        return (
        <div>
        <div id ="map" style={styles.map} > </div>
        <Newsfeed imgArray={this.state.imgArray}/>
        </div>
        )
    }
};

module.exports = MainMap