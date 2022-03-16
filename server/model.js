//imageschema for the images

var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
        title: String,
        authorName : String,
        description: String,
       // price : mongoose.Schema.Types.Double, TODO change this double or int
        address1 : String,
        address2 : String,
        city : String,
        province : String,
        zipCode : String,
        timestamp: String,
	img:
	{
		data: Buffer,
		contentType: String
	}
});

module.exports = new mongoose.model('Image', imageSchema);
