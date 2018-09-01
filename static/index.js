var BrowserRouter = require('react-router-dom').BrowserRouter;
var Navbar = require("./components/navbar");
var Routing = require("./components/routing");
var Header = require("./components/header");

// main App
class App extends React.Component {
    componentDidMount(){
    }
    render() {
        return(
    <main>
        <Header/>
        <Navbar/>
        <Routing/>
    </main>
    )};
};

ReactDOM.render(
   React.createElement(BrowserRouter, null,
            React.createElement(App, null)),
            document.getElementById('root')
);

// watchify -t reactify index.js -o App.js -v