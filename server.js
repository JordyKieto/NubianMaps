var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var http = require("http");
var path = require("path");
var bodyParser = require('body-parser');
var ObjectID = require('mongodb').ObjectID;

var app = express();
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.text({type: 'json'}))
app.use(express.static('static'))

app.get('/api/businesses/all', function(request, response) {
    db.collection("businesses").find().toArray().then(allBusinesses =>{
        console.log(allBusinesses)
        // regular request code, nothing to report
        response.status(200)
        response.json(allBusinesses)
    });
});

app.get('/api/businesses/:category', function(request, response) {
    console.log(request.params.category)
    db.collection("businesses").find(
        { category: request.params.category }
    ).toArray().then(allBusinesses =>{
        console.log(allBusinesses)
        // regular request code, nothing to report
        response.status(200)
        response.json(allBusinesses)
    });
});

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
    var idArray = [];
    JSON.parse(request.body).forEach(function(id) {
        idArray.push(ObjectID(id))
    })
    console.log(idArray)
    db.collection("businesses").remove({ "_id": { $in: idArray }})
})

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
})
})