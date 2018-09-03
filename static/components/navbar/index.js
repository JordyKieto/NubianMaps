var styles = require("../../css/styles");
var Link = require('react-router-dom').Link;

const NavLink = props => (
    <div className="NavLink" style={styles.navItem} id={props.id} onMouseOver={props.onMouseOver} onMouseOut={props.onMouseOut}>
        <li >
            <Link {...props} style={{ color: "inherit" }} />
        </li>
</div>
);

{/** the nav Grid, to make a new sublevel create ul with class navbar */}
{/** a link should make itself and every preceeding element invisible on MouseOut  */}
{/** & make itself and a next element visible on MouseOver */}
{/** following the above rules, FIRST pass select()/deselect() the NavLinks id */ }
{/**    SECONDLY in an array, pass the id's of preceeding/proceeding NavLink's   */ }

class Navbar extends React.Component {
    select(thisNav, subNavs) {
        if (subNavs) {
            subNavs.forEach(function(subNav) {
            let navItem = document.getElementById(subNav);
            navItem.style.visibility = "visible";
            })
        }
    let selectedItem = document.getElementById(thisNav);
    selectedItem.style.visibility = "visible";
    selectedItem.style.backgroundColor = "black";
    selectedItem.style.color = "white";
    }

    deSelect(thisNav, subNavs) {
        if (subNavs) {
            subNavs.forEach(function(subNav) {
            let navItem = document.getElementById(subNav);
            navItem.style.visibility = "hidden"
            });
        }
    let selectedItem = document.getElementById(thisNav);
    selectedItem.style.backgroundColor = "#e6e6e6"
    selectedItem.style.color = "black";
    }

    render() {
    return (
    <navbar>
    <ul id="navbar" style={styles.nav}>
        <NavLink to="/" id="homeNav" onMouseOver={() => this.select("homeNav", null)} 
            onMouseOut={()=> this.deSelect("homeNav", null)}
        >Home</NavLink>
        <NavLink to="/entertainment" id="entNav" onMouseOver={() => this.select("entNav", null)} 
            onMouseOut={()=> this.deSelect("entNav", null)}
        >Entertainment</NavLink>
        <NavLink to="/networking" id="netNav" onMouseOver={() => this.select("netNav", null)} 
            onMouseOut={()=> this.deSelect("netNav", null)}
        >Networking</NavLink>
        <NavLink to="/food" id="foodNav" onMouseOver={() => this.select("foodNav", null)} 
            onMouseOut={()=> this.deSelect("foodNav", null)}
        >Food</NavLink>
        <NavLink to="/cosmetics" id="cosNav" onMouseOver={() => this.select("cosNav", null)} 
            onMouseOut={()=> this.deSelect("cosNav", null)}
        >Cosmetics</NavLink>
        <NavLink to="/admin" id="adminNav" onMouseOver={() => this.select("adminNav", ["registerNav"])} 
            onMouseOut={()=> this.deSelect("adminNav", ["registerNav"])}
        >Admin</NavLink>
    </ul>
    <ul id="navbar" className="mainNavBar" style={styles.subNav}>
        <NavLink to="/"></NavLink>
        <NavLink to="/"></NavLink>
        <NavLink to="/"></NavLink>
        <NavLink to="/"></NavLink>
        <NavLink to="/"></NavLink>
        <NavLink to="/register" id="registerNav" onMouseOver={() => this.select("registerNav", ["loginNav"])} 
            onMouseOut={()=> this.deSelect("registerNav", ["loginNav", "registerNav"])}
        >Register</NavLink>
    </ul>
    <ul id="navbar" style={styles.subNav}>
        <NavLink to="/"></NavLink>
        <NavLink to="/"></NavLink>
        <NavLink to="/"></NavLink>
        <NavLink to="/"></NavLink>
        <NavLink to="/"></NavLink>
        <NavLink to="/login" id="loginNav" onMouseOver={() => this.select("loginNav", ["registerNav",  "logoutNav"])} 
            onMouseOut={()=> this.deSelect("loginNav", ["loginNav", "registerNav", "logoutNav"])}
        >Login</NavLink>
    </ul>
    <ul id="subNav" style={styles.subNav}>
        <NavLink to="/"></NavLink>
        <NavLink to="/"></NavLink>
        <NavLink to="/"></NavLink>
        <NavLink to="/"></NavLink>
        <NavLink to="/"></NavLink>
        <NavLink to="/logout" id="logoutNav" onMouseOver={() => this.select("logoutNav", ["loginNav", "registerNav"])} 
            onMouseOut={()=> this.deSelect("logoutNav", ["logoutNav", "loginNav","registerNav"])}
        >Logout</NavLink>
    </ul>
    </navbar>
    )}}

    module.exports = Navbar