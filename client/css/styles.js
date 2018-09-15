const styles = {};

styles.map = {
    position: "relative",
    top: -120,
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

  styles.subNav = {
    padding: 0,
    margin: 0,
    position: "relative",
    top: 0,
    height: "40px",
    width: "100%",
    display: "flex",
    visibility: "hidden"
  };

  styles.navItem = {
    
    textAlign: "center",
    flex: 1,
    listStyleType: "none",
    padding: "5px",
    backgroundColor: "#e6e6e6",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
    zIndex: 4,
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

  }

  styles.imgDiv = { 
      marginLeft: "auto",
      marginRight: "auto",
  };
  
  module.exports = styles