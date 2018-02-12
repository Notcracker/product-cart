let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let autoIncrement = require('mongoose-auto-increment');

let cartItemSchema = require('./cartItem');

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

cartSchema.plugin(autoIncrement.plugin, 'cart');
let Cart = mongoose.model('cart', cartSchema);
module.exports = Cart;
