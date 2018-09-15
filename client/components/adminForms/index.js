var styles = require("../../css/styles");
var Controller = require("../controller");

class postFavourites extends React.Component{
    componentDidMount(){}
    render() {
        return(
            <div>
                <form action="/api/favourites" method="post">
                <label htmlFor="username">New Favourites:</label>
                    <input type="text" name="newPlaces[]"/>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        )}};
class Login extends React.Component{
    componentDidMount(){}
    render() {
        return(
            <div>
                <form action="/api/login" method="get">
                <label htmlFor="username">Username:</label>
                    <input type="text" name="username" id="username"/>
                    <br/>
                    <label htmlFor="password">Password:</label>
                    <input type="password"  name="password" id="password"/>
                    <br/>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        )
    }
};

class Register extends React.Component{
    componentDidMount(){}
    render() {
        return(
            <div>
                <form action="/api/register" method="get">
                <label htmlFor="username">Username:</label>
                    <input type="text" name="username" id="username"/>
                    <br/>
                    <label htmlFor="password">Password:</label>
                    <input type="password"  name="password" id="password"/>
                    <br/>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        )
    }
};
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
};

class Logout extends React.Component{
    componentDidMount(){
        fetch('/api/logout');
    }
    render() {
        window.location.href = "/admin"
        return null
    }
};

class AdminListView extends React.Component {

    constructor(props){
        super(props);
    }

    // a simple text representation of the database

    async componentDidMount() {
                var allEntries = await Controller.getBusinesses('all');
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
    }

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

module.exports = {
    postFavourites: postFavourites,
    Register: Register,
    Login: Login,
    Logout: Logout,
    Authenticate: Authenticate,
    AdminListView: AdminListView
}