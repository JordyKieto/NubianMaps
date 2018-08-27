var mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favorites: { type: String }
});

userSchema.methods.hashPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
};
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}
// first argument is singular name, Mongoose automatically makes plural for collection
module.exports = mongoose.model('User', userSchema)

