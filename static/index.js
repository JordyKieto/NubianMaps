var GoogleMapsLoader = require('google-maps');
GoogleMapsLoader.KEY = require('../../keys').googleMaps
GoogleMapsLoader.LIBRARIES = ['geometry', 'places']
var BrowserRouter = require('react-router-dom').BrowserRouter
var Route = require('react-router-dom').Route
var Link = require('react-router-dom').Link
var Router = require('react-router-dom').Router

class AdminListView extends React.Component {

    componentDidMount() {
        fetch('/api/businesses/all').then(function(response){
            response.json().then(function(allEntries){
                allEntries.forEach(function(entry, index, array) {
                    var node = document.createElement("DIV")
                    var textnode = document.createTextNode(entry.name)
                    var form = document.getElementById("form")
                    var submit = document.getElementById("submitID")
                    node.appendChild(textnode)
                    var input = document.createElement("INPUT")
                    input.setAttribute('type', 'checkbox')
                    input.setAttribute('name', entry.name)
                    input.setAttribute('value', entry._id)
                    node.appendChild(input)
                    document.getElementById("form").appendChild(node)
                    form.insertBefore(node, submit)

        })
    })})}

    handlesubmit  (event)  {
        event.preventDefault()
        var entries = [];
        var formData = new FormData(event.target)
        for (let entry of formData.entries()) {
            entries.push(entry[1]);
            console.log(entries);
        }
        fetch('/api/businesses', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'},
            method: 'delete',
            body: JSON.stringify(entries)})
    
    }

    render () {
        return (
            <form onSubmit={this.handlesubmit} id="form">
            <h1>List View</h1>
            <div id="submitID">
            <br/>
            <input  type="submit"  value="Delete"/>
            </div>
            </form>
        )
    }
}

class AdminMap extends React.Component {
    componentDidMount() {
        GoogleMapsLoader.load(function(google)  {
            var map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 43.642567, lng: -79.387054},
                zoom: 13
            });
            var input = document.getElementById('pac-input');

            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo('bounds', map);

            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            var infowindow = new google.maps.InfoWindow();
            var marker = new google.maps.Marker({
                map: map
            });
            marker.addListener('click', function(){
                infowindow.open(map, marker);
            })

            autocomplete.addListener('place_changed', function(){
                infowindow.close();
                var place = autocomplete.getPlace();
                if (!place.geometry){
                    return;
                }

                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(17);
                }

                marker.setPlace({
                    placeId: place.place_id,
                    location: place.geometry.location
                });
                marker.setVisible(true);
                var infowindowContent = (place.name +'<br>'+ place.formatted_address +'<br><br>'
                +'<form action="/api/businesses" method="POST">'
                +'<input type="hidden" name="placeID" value='+place.place_id+'></input>'
                +'<input type="hidden" name="name" value='+place.name+'></input>'
                +'<input type="radio" name="category" value="entertainment">Entertainment</input><br></br>'
                +'<input type="radio" name="category" value="networking">Networking</input><br></br>'
                +'<input type="radio" name="category" value="food">Food</input><br></br>'
                +'<input type="radio" name="category" value="cosmetics">Cosmetics</input><br></br>'
                +'<input type="submit" value="Submit"></input>'
                +'</form>')
                infowindow.setContent(infowindowContent);
                infowindow.open(map, marker)
            });
        });
    }

    render() {
        var mapStyle ={
            width: "100%",
            height: "400px"
        }
        return (
        <div>

        <div id="map" style={mapStyle}></div>

        <div id="infowindow-content">
        </div>

        <input id="pac-input" className="controls" type="text" style={styles.controls}
        placeholder="Enter a location"/>
        </div>
         //   React.createElement("div", {id: "map", style: mapStyle},
         //   React.createElement("input", {id: "pac-input", type: "text", placeholder: "Enter a location"})
          //  )
        )
    }
}

class MainMap extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
		var map;
		var markers = {}
        var infowindows = {}
        fetch('/api/businesses/' + this.props.category).then(function(response){
            response.json().then(function(allBusinesses){

                allBusinesses.forEach(function(business, index, array) {

                    var request = {
                        placeId: business.placeID,
                        fields: ['name', 'geometry']
                    };
                    // creates a map
                    if (!map){
                        GoogleMapsLoader.load(function(google)  {
                            map = new google.maps.Map(document.getElementById('map'), {
                            });
                        })
                        }

                    GoogleMapsLoader.load(function(google)  {
                    
                    var bounds = new google.maps.LatLngBounds();
					// places library
					var service = new google.maps.places.PlacesService(map);
					service.getDetails(request, callback);
					
                    function callback(place, status) {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {

								// creates a marker & adds info box

								var lat = place.geometry.location.lat()
								var lng = place.geometry.location.lng()

								var name = place.name
    
                        		markers[name] = new google.maps.Marker({
                            	position: place.geometry.location,
                            	map: map
								});
					
                            	infowindows[name] = new google.maps.InfoWindow({
                                content: place.name
                                });

                                markers[name].addListener('click', function(){
                                infowindows[name].open(map, markers[name])
								});
								bounds.extend(new google.maps.LatLng(lat, lng));

						}
							map.fitBounds(bounds)
							map.setZoom(13)
					}

				});
			});
		})
        })
    }

    render() {
        var mapStyle ={
            width: "100%",
            height: "400px"
        }
        return (
            React.createElement("div", {id: "map", style: mapStyle})
        )
    }
}

const App = () => (
 
    <div>
    
    <div style={styles.header}>
    <img style={styles.logo} src="africaLogo.png"/>
    <h1 style={styles.h1}>NUBIAN MAPS</h1>
    </div>
    <ul style={styles.nav}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/entertainment">Entertainment</NavLink>
        <NavLink to="/networking">Networking</NavLink>
        <NavLink to="/food">Food</NavLink>
        <NavLink to="/cosmetics">Cosmetics</NavLink>
        <NavLink to="/admin">Admin</NavLink>
    </ul>
    <Route exact path="/" render={(props) => <MainMap {...props} category={'all'}/>} />
    <Route exact path="/entertainment" render={(props) => <MainMap {...props} category={'entertainment'}/>} />
    <Route exact path="/food" render={(props) => <MainMap {...props} category={'food'}/>} />
    <Route exact path="/cosmetics" render={(props) => <MainMap {...props} category={'cosmetics'}/>} />
    <Route exact path="/networking" render={(props) => <MainMap {...props} category={'networking'}/>} />
    <Route path="/admin" component={AdminMap}/>
    <Route path="/listview" component={AdminListView}/>
    </div>

)
const NavLink = props => (
    <li style={styles.navItem}>
      <Link {...props} style={{ color: "inherit" }} />
    </li>
  );

const styles = {};

styles.nav = {
    padding: 0,
    margin: 0,
    position: "relative",
    top: 0,
    height: "40px",
    width: "100%",
    display: "flex"
  };

  styles.navItem = {
    textAlign: "center",
    flex: 1,
    listStyleType: "none",
    // change to padding everywhere except top
    padding: "5px",
    backgroundColor: "#e6e6e6",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
  };

  styles.header = {
 //     textAlign: "center",
      width: "100%",
      height: "50px",
      padding: 0,
      margin: 0,
      backgroundColor: "black",
      color: "white"

  }

  styles.controls = {
      backgroundColor: "#fff",
      borderRadius: "2px",
      broder: "1px solid transparent",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
      boxSizing: "border-box",
      marginLeft: "17px",
      height: "29px",
      marginTop:"10px",
      padding: "0 11px 0 13px",
      width: "400px"

  }

  styles.logo = {
      width: 50,
  }

  styles.h1 = {
    textAlign: "left",
    top: -5,
    width: "100%",
    left: "70px",
    zIndex: 1,
    position: "absolute"
  }

ReactDOM.render(
   React.createElement(BrowserRouter, null,
            React.createElement(App, null)),
            document.getElementById('root')
);

// watchify -t reactify index.js -o App.js -v