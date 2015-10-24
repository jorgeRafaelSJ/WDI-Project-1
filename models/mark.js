var mongoose = require('mongoose');

var markSchema = mongoose.Schema({
	businessName: String,
	address: String,
	location: String,
	latitude: String,
	longitude: String,
    crowdLevel: String,
    lastSong: String,
    happyHour: String,
    review: String,
});

var Mark = mongoose.model('Mark', markSchema);


module.exports = Mark;