let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let autoIncrement = require('mongoose-auto-increment');

let cartItemSchema = new Schema({
  _id: {
		type: Number,
		required: true
  },
  quantity: {
		type: Number,
		required: true
  },
  sum: {
		type: Number,
		required: true
  },
});

module.exports = cartItemSchema;
