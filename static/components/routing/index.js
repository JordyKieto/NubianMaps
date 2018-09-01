var {postFavourites, Login, Register, Authenticate} = require("../adminForms");
var MainMap = require("../maps/mainMap");
var AdminMap = require("../maps/adminMap");
var Route = require('react-router-dom').Route;

class Routing extends React.Component {
    render() {
        return(
            <div>
                {/** https://zhenyong.github.io/react/docs/jsx-spread.html */}
                {/** https://reacttraining.com/react-router/web/api/Route/render-func */}
                <Route exact path="/" render={(props) => <MainMap {...props} category={'all'}/>} />
                <Route exact path="/entertainment" render={(props) => <MainMap {...props} category={'entertainment'}/>} />
                <Route exact path="/food" render={(props) => <MainMap {...props} category={'food'}/>} />
                <Route exact path="/cosmetics" render={(props) => <MainMap {...props} category={'cosmetics'}/>} />
                <Route exact path="/networking" render={(props) => <MainMap {...props} category={'networking'}/>} />
                <Route exact path="/favourites" render={(props) => <MainMap {...props} category={'favourites'}/>} />
                <Route path="/postFavourites" component={postFavourites}/>
                <Route path="/admin" component={AdminMap}/>
                <Route path="/authenticate" component={Authenticate}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
            </div>
        )}
};

module.exports = Routing