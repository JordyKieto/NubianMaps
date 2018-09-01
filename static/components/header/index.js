var styles = require("../../css/styles");

class Header extends React.Component {
    render() {
        return(
            <header style={styles.header}>
            <a href="/favourites"><img src="/star.png" id="favouriteStar" /></a>
            <img style={styles.logo} src="africaLogo.png"/>
            <h1 style={styles.h1}>NUBIAN FAPS</h1>
            </header>
    )};
};
module.exports = Header;