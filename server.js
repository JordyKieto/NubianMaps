var express = require("express");
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var uri = process.env.MONGOLAB_URI;
var port = process.env.PORT || 8080;
var passport = require('passport');
var routes = require("./routes");
var morgan = require("morgan")

require('./config/passport')(passport);

var app = express();
app.use(morgan('dev'))
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.text({type: 'json'}));
app.use(bodyParser.json());
app.use(express.static('static'));
// needs to call app.use(session BEFORE app.use(passport.session
app.use(session({ secret: 'black'}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/", routes);

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
};