var BrowserRouter = require('react-router-dom').BrowserRouter;
var styles = require("./css/styles");
var Navbar = require("./components/navbar");
var Routing = require("./components/routing");

// main App
class App extends React.Component {
    componentDidMount(){
    }
    
    render() {
        return(
 
    <main>
    <div style={styles.header}>
    <a href="/favourites"><img src="/star.png" id="favouriteStar" /></a>
    <img style={styles.logo} src="africaLogo.png"/>
    <h1 style={styles.h1}>NUBIAN MAPS</h1>
    </div>
    <Navbar/>
    <Routing/>
    </main>
)
}};

ReactDOM.render(
   React.createElement(BrowserRouter, null,
            React.createElement(App, null)),
            document.getElementById('root')
);

// watchify -t reactify index.js -o App.js -v