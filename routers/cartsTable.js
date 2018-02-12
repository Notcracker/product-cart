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
					if (cartItem._id === product_id) {
						index = i;
						return product
					};
				});

				if (found) {
					console.log('case 2');
					products.forEach((item, i) => {
						if (i === index) {
							item.quantity += quantity;
							item.sum += product.price * quantity;
						}
					});

					console.log(products);

					Cart.findByIdAndUpdate(cart._id, {
			        $set: {
								total_sum: (product.price * quantity) + cart.total_sum ,
								products_count: quantity + cart.products_count,
								products,
							}
				    }).exec((err, cart) => {
			       	if (err) {
		           	console.log(err);
		           	res.status(500).end(err);
			       	} else {
		            res.status(200).end();
							}
						});
				} else {
					console.log('case 3', product);
					products.push({_id: product_id, quantity, sum: product.price * quantity});

					Cart.findByIdAndUpdate(cart._id, {
						$set: {
							total_sum: (product.price * quantity) + cart.total_sum ,
							products_count: quantity,
							products: products,
						}
		    	}, (err, cart) => {
						if (err) throw err;

						res.status(200).end();
					});
				}
			} else {
				console.log('case 4');
				Cart.create({
					total_sum: quantity * product.price,
					products_count: quantity,
					products: [{
						_id: product._id,
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
	Cart.findByIdAndRemove(req.body.product_id, (err, product) => {
		if (err) throw err;
		res.end();
	})
})

module.exports = cart;
