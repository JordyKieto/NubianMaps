var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var http = require("http");
var path = require("path");
var mongoose = require('mongoose');
var Business = require("./models/businesses")
var bodyParser = require('body-parser');
var ObjectID = require('mongodb').ObjectID;
var mapsKey = process.env.MAPS_KEY
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var session = require('express-session')
var nubianKey = process.env.NUBIAN_KEY
var uri = process.env.MONGOLAB_URI;
var port = process.env.PORT || 8080;

var admin = {
    username: "admin",
    password: nubianKey,
    id: "1234"
};

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
))

var app = express();
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.text({type: 'json'}))
app.use(bodyParser.json());
app.use(express.static('static'))
// needs to call app.use(session BEFORE app.use(passport.session
app.use(session({ secret: 'black'}))

app.use(passport.initialize());
app.use(passport.session());

app.get('/api/businesses', function(request, response) {
    if (request.query.category === 'all') {
        Business.find({}).then(allBusinesses =>{
            console.log(allBusinesses)
            // regular request code, nothing to report
            response.status(202)
            response.json(allBusinesses)
        });
    } else {
    console.log(request.query.category)
    Business.find(
        { category: request.query.category }
    ).then(allBusinesses =>{
        console.log(allBusinesses)
        response.status(200)
        response.json(allBusinesses)
    })};
});
app.get('/api/businesses/:_id', function(request, response){
    var _id = ObjectID(request.params._id)
    Business.find(
    { "_id": _id }
    ).then(businessInfo =>{
        console.log(businessInfo)
        response.status(200)
        response.json(businessInfo)
    });

})

app.put('/api/businesses/:_id', function(request, response){
    if (request.isAuthenticated()) {
    console.log(request.body)
    var body = request.body
    var _id = ObjectID(request.params._id)
    Business.findOneAndUpdate(
        { "_id": _id }, { $set: {"name": body.name}}
    ) 
    } else {response.sendStatus(401)}
});
app.post('/api/businesses', function(request, response){
    if (request.isAuthenticated()) {
    var body = request.body
    console.log(request.body)
    Business.insertOne({ name: request.body.name, 
                                            category: request.body.category, 
                                            placeID: request.body.placeID
                                         });
    // indicates success and "stay on current page"
    response.status(204)
    response.redirect('/admin')
        }
    else {response.sendStatus(401)}
});
app.delete('/api/businesses', function(request, response){
    if (request.isAuthenticated()) {
    var _idArray = [];
    request.body.forEach(function(_id) {
        _idArray.push(ObjectID(_id))
    })
    console.log(_idArray)
    Business.remove({ "_id": { $in: _idArray }});
    response.status(202);
    response.redirect('/admin');
        }
    else {response.sendStatus(401)}
})
app.get('/api/mapsKey', function(request, response) {
    response.json(mapsKey)
})
app.get('/api/authenticate', passport.authenticate('authenticate', {successRedirect: '/admin',
                                                            failureRedirect: '/authenticate'
                                                    }));

app.get('/api/logout', function(request, response) {
    if (request.isAuthenticated()) {
        console.log('logging out and destroying session');
     //   request.session = null;
        request.logout();
    //    request.user = null,
        response.redirect('/admin')
    }
});
app.get('/checkAuthentication', function(request, response) {
    if (request.isAuthenticated()) {
        response.json(true)
    } else {response.json(false)}
});                                                
// for all other requests, send index. allows react app too handle rest of routing
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'static/index.html'), function(err) {
      if (err) {
        res.status(500).send(err)
      }
    })
});
let db = 'blank'
mongoose.connection.on('connected', function (err) {
    console.log("Mongo connect success on... "+ mongoose.connection.name)
   });
mongoose.connect( uri || 'mongodb://localhost').then(() =>{
    app.server = app.listen(port, function(){
    console.log('Nubian Maps on '+ app.server.address().port)
});
});
module.exports = {
    app: app,
    admin: admin
}