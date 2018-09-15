var mongoose = require('mongoose');

var businessSchema = mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    placeID: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Business', businessSchema, "businesses");