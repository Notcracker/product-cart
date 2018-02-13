let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let autoIncrement = require('mongoose-auto-increment');

let cartItemSchema = require('./cartItem');
let transform = require('../utils').transform;

let cartSchema = new Schema({
  total_sum: {
		type: Number,
		required: true
	},
  products_count: {
		type: Number,
		required: true
  },
  products: [cartItemSchema]
});

transform(cartSchema);
cartSchema.plugin(autoIncrement.plugin, { model: 'cart'});
let Cart = mongoose.model('cart', cartSchema);
module.exports = Cart;
