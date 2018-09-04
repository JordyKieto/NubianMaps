var Newsfeed = require("../newsfeed/newsfeed");

var styles = require("../../css/styles");
var Controller = require("./controller");


class MainMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgArray: []
        }
    };
    async componentDidMount() {
        var self = this;
        var map = await Controller.initMap();
        var allBusinesses = await Controller.getBusinesses(this.props.category);
        Controller.visibleNewsfeed(true);
        Controller.populateMap(allBusinesses, map, self);
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