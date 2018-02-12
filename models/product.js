let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let autoIncrement = require('mongoose-auto-increment');

let productSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
});

productSchema.plugin(autoIncrement.plugin, 'product');
let Product = mongoose.model('product', productSchema);
module.exports = Product;
