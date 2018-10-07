var Newsfeed = require("../newsfeed");
const React = require('react');
var styles = require("../../css/styles");
var Controller = require("../controller");

class MainMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgArray: [],
            myMarkers: [],
        }
    };
    async componentDidMount() {
        var self = this;
        await Controller.setupAPI(this.props.google);
        var map = await Controller.initMap();
        var allBusinesses = await Controller.getBusinesses(this.props.category);
        var allPlaces = await Controller.getPlaces(allBusinesses, map);
        var {markers, infoWindows} =  await Controller.createMarkers(allPlaces, map);
        Controller.createPlaceImgs(allPlaces, map, infoWindows, markers, self)
        Controller.visibleNewsfeed(true);
        var myLocation = await Controller.getMyLocation();
        var myLocationMarker = Controller.markMyLocation(myLocation, map);
        Controller.calcDistances(myLocationMarker, markers);
    };
    render() {
        return (
        <div>
        <div id ="map" style={styles.map} > </div>
        {/** the Newsfeed is tightly coupled to update on every Map update */}
        <Newsfeed imgArray={this.state.imgArray}/>
        </div>
        )
    }
};

module.exports = MainMap