var Newsfeed = require("../newsfeed");
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
        var promise = new Promise(async(resolve, reject)=>{
            var self = this;
            await Controller.setupAPI(this.props.google);
            var map = await Controller.initMap();
            var allBusinesses = await Controller.getBusinesses(this.props.category);
            var allPlaces = await Controller.getPlaces(allBusinesses, map);
            var markers =  await Controller.createMarkers(allPlaces, map);
            var infowindows = Controller.createFavInfoWs(allPlaces);
            //var infowindows = Controller.createVoteWindows(allPlaces);
            markers = Controller.bindMarkersInfoW(markers, infowindows, map);
            Controller.createPlaceImgs(allPlaces, map, infowindows, markers, self);
            Controller.visibleNewsfeed(true);
            var myLocation = await Controller.getMyLocation();
            var myLocationMarker = Controller.markMyLocation(myLocation, map);
            Controller.calcDistances(myLocationMarker, markers);
            resolve({
                map: map,
                allBusinesses: allBusinesses,
                markers: markers,
                infowindows: infowindows
            });
        });
        return promise;
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