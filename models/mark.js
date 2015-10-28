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
    createdAt: {type: Date, required: true, expiresAfterSeconds: 3600, default: Date.now}
});

var Mark = mongoose.model('Mark', MarkSchema);



module.exports = Mark;