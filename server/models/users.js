var mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');
var ObjectID = require('mongodb').ObjectID;

var userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Business', unique: true }]
});

userSchema.methods.hashPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
};
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

userSchema.methods.addToFavourites = function(newPlace) {
    var newFavourite = ObjectID(newPlace)
    console.log('OBJID: ' + newFavourite)
    this.favourites.push(newFavourite);
    this.save();
}
// first argument is singular name, Mongoose automatically makes plural for collection
module.exports = mongoose.model('User', userSchema)

