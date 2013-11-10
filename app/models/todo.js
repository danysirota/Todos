var mongoose = require('mongoose'),
  	Schema = mongoose.Schema,
  	ObjectId = Schema.ObjectId;

var TodoSchema = new Schema({
	text: String,
	finished: Boolean,
	creator: String
});

module.exports = mongoose.model('Todo', TodoSchema);