let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let	assert = require('assert');

let Cart = require('../models/cart');
let Product = require('../models/product');

let cart = express.Router();

cart.use(bodyParser.json());
cart.route('/cart')
.get((req, res, next) => {
	Cart.find({},(err, products) => {
		if (err) throw err;
		res.json(products);
	})
})
.post((req, res, next) => {
	let { product_id, quantity } = req.body;

	Product.findById(product_id, (err, product) => {
		if (err) throw err;
		if (quantity < 1 || quantity > 10) throw (new Error('Wrong quantity range.'));

		Cart.find({}, (err, carts) => {
			if (err) throw err;

			if (carts.length) {
				let cart = carts[0];
				let index = null;
				let products = cart.products;
				let found = products.find((cartItem, i) => {
					if (cartItem.id === product_id) {
						index = i;
						return product;
					};
				});

				if (found) {
					products.forEach((item, i) => {
						if (i === index) {
							item.quantity += quantity;
							item.sum += product.price * quantity;
						}
					});

					Cart.findByIdAndUpdate(cart.id, {
			        $set: {
								total_sum: (product.price * quantity) + cart.total_sum ,
								products_count: quantity + cart.products_count,
								products,
							}
				    }).exec((err, cart) => {
			       	if (err) {
		           	res.status(500).end(err);
			       	} else {
		            res.status(200).end();
							}
						});
				} else {
					products.push({_id: product_id, quantity, sum: product.price * quantity});

					Cart.findByIdAndUpdate(cart.id, {
						$set: {
							total_sum: (product.price * quantity) + cart.total_sum ,
							products_count: quantity,
							products: products,
						}
		    	}, (err, cart) => {
						if (err) throw err;
					});
				}
			} else {
				Cart.create({
					total_sum: quantity * product.price,
					products_count: quantity,
					products: [{
						_id: product.id,
						quantity,
						sum: quantity * product.price,
					}],
				}, (err, cart) => {
					if (err) throw err;

					res.status(200).end();
				});
			}
		})
	})
})
.delete((req,res,next) => {
	Cart.find({}, (err, carts) => {
		if (err) throw err;

		if (carts.length) {
			let cart = carts[0];
			let products = cart.products;
			let excludedProduct = null;
			let products = products.filter((product) => {
				if (product.id !== req.body.product_id) {
					return product;
				}
				excludedProduct = product;
			});
			let { price, quantity } = excludedProduct;

			Cart.findByIdAndUpdate(cart.id, {
					$set: {
						total_sum: cart.total_sum - (price * quantity),
						products_count: cart.products_count -  quantity,
						products,
					}
				}).exec((err, cart) => {
					if (err) {
						res.status(500).end(err);
					} else {
						res.status(200).end();
					}
				});
	})
})

module.exports = cart;
