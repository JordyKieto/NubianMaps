var LocalStrategy = require('passport-local').Strategy;
var User = require("../models/users")
var admin = require('./defaultAdmin').admin;

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        // id returns string of _id
        done(null, user.id)
    });
    
    passport.deserializeUser(function(id, done) {
        if(id === admin.id) {
        // don't serialize sensitive info
        // **TODO** also protect User method
        var adminDeSerial = Object.assign({password: null}, admin)
        done(null, adminDeSerial)
        } else {
            User.findById(id, function(err, user) {
                done(err, user)
            });
        }
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
    passport.use('register', new LocalStrategy(
        function(username, password, done) {
            User.findOne({ username: username }, function(err, user) {
            if(err)
            {done(null, err)};
            if(user) 
            {return done(null, false)}
            else {
                newUser = new User();
                newUser.password = newUser.hashPassword(password);
                newUser.username = username;
                try {
                newUser.save( function(err) {
                    if(err){
                        throw err;
                    };
                    return done(null, newUser)
                })}
                catch(err){ 
                    throw err;}
                finally{
                    return done(null, false)
                };
                };
            });
            }
    ));
    passport.use('login', new LocalStrategy(
        function(username, password, done) {
            User.findOne({ username: username }, function(err, user) {
            if(err){
                done(null, err)
            }
            if(user.validatePassword(password)){
                return done(null, user)
            }
            else {
                return done(null, false)
            };
            })}
    ));
};