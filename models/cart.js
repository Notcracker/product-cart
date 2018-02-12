let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let autoIncrement = require('mongoose-auto-increment');

let cartItemSchema = require('./cartItem');

let cartSchema = new Schema({
  id: {
		type: Number,
		required: true
	},
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

cartSchema.plugin(autoIncrement.plugin, { model: 'cart', field: 'id' });
let Cart = mongoose.model('cart', cartSchema);
module.exports = Cart;
