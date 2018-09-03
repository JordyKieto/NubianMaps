var router = require("express").Router();
var path = require("path");
var Business = require("../models/businesses");
var mapsKey = process.env.MAPS_KEY;
var ObjectID = require('mongodb').ObjectID;
var passport = require('passport');
var User = require("../models/users");

router.get('/api/businesses', function(request, response) {
    console.log(request.query.category);
    if (request.query.category === 'favourites') {
        getFavourites(request, response);
    }
    else if (request.query.category === 'all') {
        Business.find({}).then(allBusinesses =>{
            // regular request code, nothing to report
            response.status(200)
            response.json(allBusinesses)
        });
    } else {
    Business.find(
        { category: request.query.category }
    ).then(allBusinesses =>{
        response.status(200)
        response.json(allBusinesses)
    })};
});
router.get('/api/businesses/:_id', function(request, response){
    var _id = ObjectID(request.params._id)
    console.log(_id)
    Business.find(
    { "_id": _id }
    ).then(businessInfo =>{
        console.log(businessInfo)
        response.status(200)
        response.json(businessInfo)
    });

});
router.put('/api/businesses/:_id', function(request, response){
    if (request.isAuthenticated()) {
    console.log(request.body)
    var body = request.body
    var _id = ObjectID(request.params._id);
    Business.findOneAndUpdate(
        { "_id": _id }, { $set: {"name": body.name}}
    ) 
    } else {response.sendStatus(401)}
});
router.post('/api/businesses', function(request, response){
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
router.delete('/api/businesses', function(request, response){
    if (request.isAuthenticated()) {
    var _idArray = [];
    request.body.forEach(function(_id) {
        _idArray.push(ObjectID(_id))
    })
    console.log(_idArray)
    Business.remove({ "_id": { $in: _idArray }});
    response.status(200);
    response.redirect('/admin');
        }
    else {response.sendStatus(401)}
});
router.get('/api/mapsKey', function(request, response) {
    response.json(mapsKey)
});
router.get('/api/authenticate', passport.authenticate('authenticate', {successRedirect: '/admin',
                                                            failureRedirect: '/authenticate'
                                                    })
);
router.get('/api/logout', function(request, response) {
    if (request.isAuthenticated()) {
        console.log('logging out and destroying session');
     //   request.session = null;
        request.logout();
    //    request.user = null,
        response.redirect('/admin')
    }
});
router.get('/api/register', passport.authenticate('register', {successRedirect: '/admin',
                                                            failureRedirect: '/register'
                                                    })
);
router.get('/api/login', passport.authenticate('login', {successRedirect: '/admin',
                                                            failureRedirect: '/login'
                                                    })
);
router.get('/api/checkAuthentication', function(request, response) {
    if (request.isAuthenticated()) {
        console.log(request.user.username);
        response.json(true);
    } else {response.json(false)}
});
router.post('/api/favourites', function(request, response) {
    console.log(request.body);
    var newPlace = JSON.stringify(request.body.id);
    newPlace.trim();
   // [...] is characterset, \ before special char means next one should be interprerted literally
    newPlace = newPlace.replace(/[[\]]/g, '').replace(/(["])/g, '');
    console.log(newPlace);
    if (request.isAuthenticated()) {
        User.findById(request.user.id)
        .then(function(user) {
            user.addToFavourites(newPlace);
            response.status(200).redirect('/favourites');
        })
    } else {
        response.redirect('/login')
    }
});
router.get('/api/favourites', function(request, response) {
    getFavourites(request, response); 
});

var getFavourites = function(request, response) {
    if(request.isAuthenticated()){
        User.findById(request.user.id)
        .populate('favourites')
        // query will not run until exec or then
        .exec(function (err, user) {
            if(err) {throw err}
            else{
                console.log(user.favourites);
                response.status(200).json(user.favourites);
            }
        })
    } else {response.redirect('/admin')}
}
// for all other requests, send index. allows react app too handle rest of routing
router.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../static/index.html'), function(err) {
      if (err) {
        res.status(500).send(err)
      }
    })
});

module.exports = router;