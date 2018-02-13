let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let autoIncrement = require('mongoose-auto-increment');

let transform = require('../utils').transform;

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

transform(productSchema);

productSchema.plugin(autoIncrement.plugin, { model: 'product'});
let Product = mongoose.model('product', productSchema);
module.exports = Product;
