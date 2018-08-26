var LocalStrategy = require('passport-local').Strategy;
var admin = require('./defaultAdmin').admin;

console.log(admin);

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id)
    });
    
    passport.deserializeUser(function(id, done) {
        // don't serialize sensitive info
        var adminDeSerial = Object.assign({password: null}, admin)
        done(null, adminDeSerial)
    });
    
    passport.use('authenticate', new LocalStrategy(
        function(username, password, done) {
            if(username === admin.username && password === admin.password) {
                console.log("succesful authentication!")
                return done(null, admin)} else {
                    console.log("failed authentication"); 
                    return done(null, false)}
            }
    ));
}