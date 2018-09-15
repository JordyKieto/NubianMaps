var React = require('react');

var styles = require("../../css/styles");

class Header extends React.Component {
    render() {
        return(
            <header style={styles.header}>
            <a href="/favourites"><img src="./images/favourite.png" id="favouriteStar" /></a>
            <img style={styles.logo} src="./images/africaLogo.png"/>
            <h1 style={styles.h1}>NUBIAN MAPS</h1>
            </header>
    )};
};
module.exports = Header;