var mongoose = require('mongoose');

var MarkSchema = mongoose.Schema({
	businessName: String,
	address: String,
	latitude: Number,
	longitude: Number,
    crowdLevel: String,
    lastSong: String,
    happyHour: String,
    review: String,
});

var Mark = mongoose.model('Mark', MarkSchema);



module.exports = Mark;