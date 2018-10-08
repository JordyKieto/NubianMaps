var GoogleMapsLoader = require('google-maps');
GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
var {AdminListView} = require("../adminForms")
var styles = require("../../css/styles");
var Controller = require("../controller");

class AdminMap extends React.Component {
    // creates a map with autocomplete search bar
    async componentDidMount() {
        await Controller.setupAPI(this.props.google);
        var map = await Controller.initMap();
        Controller.visibleNewsfeed(false);
        Controller.bindAutoComp(map);
};

    render() {
        return (
        <div id="mapdiv">
        <div id="map" style={styles.map}></div>
        <div id="infowindow-content">
        </div>
        <input id="pac-input" className="controls" type="text" style={styles.controls}
        placeholder="Enter a location"/>
        <AdminListView/>
        </div>
        )
    }
}

module.exports = AdminMap;