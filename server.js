var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var http = require("http");
var path = require("path");
var bodyParser = require('body-parser');
var ObjectID = require('mongodb').ObjectID;
var mapsKey = process.env.MAPS_KEY

var app = express();
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.text({type: 'json'}))
app.use(bodyParser.json());
app.use(express.static('static'))

app.get('/api/businesses', function(request, response) {
    if (request.query.category === 'all') {
        db.collection("businesses").find().toArray().then(allBusinesses =>{
            console.log(allBusinesses)
            // regular request code, nothing to report
            response.status(200)
            response.json(allBusinesses)
        });
    } else {
    console.log(request.query.category)
    db.collection("businesses").find(
        { category: request.query.category }
    ).toArray().then(allBusinesses =>{
        console.log(allBusinesses)
        response.status(200)
        response.json(allBusinesses)
    })};
});

app.get('/api/businesses/:_id', function(request, response){
    var _id = ObjectID(request.params._id)
    db.collection("businesses").find(
    { "_id": _id }
    ).toArray().then(businessInfo =>{
        console.log(businessInfo)
        response.status(200)
        response.json(businessInfo)
    });

})

app.put('/api/businesses/:_id', function(request, response){
    console.log(request.body)
    var body = JSON.parse(request.body)
    var _id = ObjectID(request.params._id)
    db.collection("businesses").findOneAndUpdate(
        { "_id": _id }, { $set: {"name": body.name}}
    )}
);

app.post('/api/businesses', function(request, response){
    var body = request.body
    console.log(request.body)
    db.collection("businesses").insertOne({ name: request.body.name, 
                                            category: request.body.category, 
                                            placeID: request.body.placeID
                                         });
    // indicates success and "stay on current page"
    response.status(204)
    response.end()
});

app.delete('/api/businesses', function(request, response){
    var _idArray = [];
    JSON.parse(request.body).forEach(function(_id) {
        _idArray.push(ObjectID(_id))
    })
    console.log(_idArray)
    db.collection("businesses").remove({ "_id": { $in: _idArray }})
})

app.get('/api/mapsKey', function(request, response) {
    response.json(mapsKey)
})

// for all other requests, send index. allows react app too handle rest of routing
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'static/index.html'), function(err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  })
let db = 'blank'
MongoClient.connect('mongodb://localhost').then(client =>{
    db = client.db('blackBusinesses');
    console.log(db);
    http.createServer(app).listen(8080, function(){
    console.log('Nubian Maps on 8080')
    console.log(mapsKey)
})
})