var GoogleMapsLoader = require('google-maps');
GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
var BrowserRouter = require('react-router-dom').BrowserRouter;
var Route = require('react-router-dom').Route;
var Link = require('react-router-dom').Link;
var Router = require('react-router-dom').Router;
GoogleMapsLoader.KEY = 'AIzaSyANJoY1-ND72EtVf5AFXW6vkbmotvu4Y_c';

function Newsfeed(props) {
    var feed = props.imgArray.map(function (feedItem) {
        return React.createElement("div", {style: styles.imgDiv}, React.createElement("img", {className: "feedItem", style: styles.placeImg, src: feedItem.src, onMouseOver: feedItem.onmouseover, onMouseOut: feedItem.onmouseout})
                        )});
                                            
    return (
        React.createElement("div", {id: "newsfeed"}, feed)
    )
}


class AdminListView extends React.Component {

    constructor(props){
        super(props);
    }

    // a simple text representation of the database

    componentDidMount() {
        fetch('/api/businesses?category=all').then(function(response){
            response.json().then(function(allEntries){
                allEntries.forEach(function(entry, index, array) {
                    var node = document.createElement("DIV")
                    var textnode = document.createElement("INPUT")
                    var editButton = document.createElement("INPUT")
                    editButton.onclick  = function(){
                        fetch('/api/businesses/' + entry._id, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'},
                        body: JSON.stringify({ "name": textnode.value}),
                        method: "put",
                    });
    
                }
                    editButton.setAttribute('value', 'Update');
                    editButton.setAttribute('type', 'button');
                    textnode.setAttribute('type', 'text');
                    textnode.setAttribute('value', entry.name);
                    var form = document.getElementById("form");
                    var submit = document.getElementById("submitID");
                    node.appendChild(textnode);
                    var input = document.createElement("INPUT");
                    input.setAttribute('type', 'checkbox');
                    input.setAttribute('name', entry.name);
                    input.setAttribute('value', entry._id);
                    input.setAttribute('class', "adminInput");

                    node.appendChild(input);
                    node.appendChild(editButton)
                    document.getElementById("form").appendChild(node);
                    // adds the submit button to end of form
                    form.insertBefore(node, submit);

        })
    })})}

    handlesubmit  (event)  {
        var self = this;
        event.preventDefault()
        var entries = [];
        var formData = new FormData(event.target)
        for (let entry of formData.entries()) {
            entries.push(entry[1]);
        }
        
        fetch('/api/businesses', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'},
            method: 'delete',
            body: JSON.stringify(entries)}).then(function(){location.reload();}); 
    }
    render () {
        return (
            <div id="adminForm">
            <form onSubmit={this.handlesubmit} id="form" style={styles.admin}>
            <div id="submitID">
            <br/>
            <input  type="submit"  value="Delete"/>
            </div>
            </form>
            </div>
        )
    }
}

class AdminMap extends React.Component {
    // creates a map with autocomplete search bar
    componentDidMount() {
        var newsfeed = document.getElementById("newsfeed")
        newsfeed.style = "visibility:hidden"
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
                // fills the infowindow with a form to add selected business
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
    })}

    render() {
        return (
        <div>

        <div id="map" style={styles.map}></div>

        <div id="infowindow-content">
        </div>

        <input id="pac-input" className="controls" type="text" style={styles.controls}
        placeholder="Enter a location"/>
        <AdminListView/>
        </div>
         //   React.createElement("div", {id: "map", style: mapStyle},
         //   React.createElement("input", {id: "pac-input", type: "text", placeholder: "Enter a location"})
          //  )
        )
    }
}

class MainMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgArray: []
        }
    }
// displays various groups of businesses based on the URL param supplied in props
    async componentDidMount() {

        var newsfeed = document.getElementById("newsfeed")
        newsfeed.style = "visibility:visible"
        var map;
        var imgArray = []        
		var markers = {}
        var infowindows = {}
        var self = this;
       
        await fetch("/api/businesses?category=" + this.props.category).then(function(response){
                response.json().then(function(allBusinesses){
        
                allBusinesses.forEach(function(business, index, array) {
                    var request = {
                        placeId: business.placeID,
                        fields: ['name', 'geometry', 'photos']
                    };
                    if (!map){
                        GoogleMapsLoader.load(function(google)  {
                            map = new google.maps.Map(document.getElementById('map'), {
                            });
                        })
                        }
                    
                    GoogleMapsLoader.load(function(google)  {
                    
                    var bounds = new google.maps.LatLngBounds();
					var service = new google.maps.places.PlacesService(map);
					service.getDetails(request, callback);
					
                    function callback(place, status) {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                                var imgDiv = document.createElement("div");
                                var placeImg = {}
                                var newsfeed = document.getElementById("newsfeed");
                                try {
                                    placeImg.src = place.photos[0].getUrl({'maxWidth': 650, 'maxHeight': 650});
                                }
                                catch(err) {
                                 // no image for this place, setting default
                                    placeImg.src = '/altLogo.png'
                                }
                                var name = place.name
                                placeImg.id = "feedItem";
                                
								var lat = place.geometry.location.lat()
								var lng = place.geometry.location.lng()
    
                        		var marker = new google.maps.Marker({
                            	position: place.geometry.location,
                                map: map,
								});
					
                            	var infowindow = new google.maps.InfoWindow({
                                content: place.name
                                });

                                marker.addListener('click', function(){
                                infowindow.open(map, marker)
								});
                                bounds.extend(new google.maps.LatLng(lat, lng));
                                
                                placeImg.onmouseover = function(){
                                    google.maps.event.trigger(marker, 'click');
                                    map.setZoom(15);
                                    map.panTo(place.geometry.location)
                                };
                                placeImg.onmouseout = function(){infowindow.close()};
                                imgArray.push(placeImg);
                                (() => {
                                    self.setState({
                                    imgArray: imgArray
                                })
                            })()
                               
						}
							map.fitBounds(bounds)
							map.setZoom(13)
					};
			});
        });
       
    });
    });
    };

    render() {
        return (
        <div>
        <div id ="map" style={styles.map}> </div>
        <Newsfeed imgArray={this.state.imgArray}/>
        </div>
        )
    }
}

class Authenticate extends React.Component{
    componentDidMount(){}
    render() {
        return(
            <div>
                <form action="/api/authenticate" method="get">
                    <label htmlFor="password">Password:</label>
                    <input type="password"  name="password" id="password"/>
                    <input type="hidden" name="username" value="admin"/>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        )
    }
}
// main App
class App extends React.Component {
    componentDidMount(){
    }
    
    
    render() {
        return(
 
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
    <Route path="/authenticate" component={Authenticate}/>
    </div>

)
}}
const NavLink = props => (
    <li style={styles.navItem}>
      <Link {...props} style={{ color: "inherit" }} />
    </li>
  );

const styles = {};

styles.map = {
    width: "100%",
    height: "800px"
}

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

  styles.admin = {
  //    backgroundColor: "black",
      top: -300,
      position: "relative",
      width: "270px",
  }

  styles.placeImg = {
    height: "355px",
    width: "285px",
    boxShadow: "10px 1px 25px",
    paddingBottom: "30px"
  }

  styles.imgDiv = { 
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
  }

ReactDOM.render(
   React.createElement(BrowserRouter, null,
            React.createElement(App, null)),
            document.getElementById('root')
);

// watchify -t reactify index.js -o App.js -v