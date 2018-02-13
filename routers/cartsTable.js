let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let	assert = require('assert');

let Cart = require('../models/cart');
let Product = require('../models/product');

let makeErrorMessage = require('../utils').makeErrorMessage;

let cart = express.Router();

cart.use(bodyParser.json());
cart.route('/cart')
.get((req, res, next) => {
	Cart.find({},(err, carts) => {
		if (err) {
			res.status(500).end();
			return;
		}
		let cart = carts[0];

		if (cart) {
			cart.products.forEach(product => {
				product.toJSON();
			});
			res.json({data: cart.toJSON()});
		} else {
			res.json(carts);
		}
	})
})
.post((req, res, next) => {
	let { product_id, quantity } = req.query;

	if (!product_id || !product_id.length || !quantity || !quantity.length) {
		res.status(400).json(makeErrorMessage(!product_id ? 'product_id' : 'quantity'));
		return;
	}

	product_id = +product_id;
	quantity = +quantity;

	Product.findById(product_id, (err, product) => {
		if (err) {
			res.status(500).end();
			return;
		}
		if (!product || quantity < 1 || quantity > 10) {
			res.status(400).json(makeErrorMessage('invalid'));
			return;
		};

		Cart.find({}, (err, carts) => {
			if (err) {
				res.status(500).end();
				return;
			}

			if (carts.length) {
				let cart = carts[0];
				let index = null;
				let products = cart.products;
				let found = products.find((cartItem, i) => {
					if (cartItem._id === product_id) {
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

					Cart.findByIdAndUpdate(cart._id, {
			        $set: {
								total_sum: (product.price * quantity) + cart.total_sum ,
								products_count: quantity + cart.products_count ,
								products,
							}
				    }, (err, cart) => {
			       	if (err) {
		           	res.status(500).end();
			       	} else {
		            res.status(200).end();
							}
						});
				} else {
					products.push({_id: product_id, quantity, sum: product.price * quantity});

					Cart.findByIdAndUpdate(cart._id, {
						$set: {
							total_sum: (product.price * quantity) + cart.total_sum ,
							products_count: cart.products_count  + quantity ,
							products: products,
						}
		    	}, (err, cart) => {
						if (err) {
							res.status(500).end();
						} else {
							res.status(200).end();
						}
					});
				}
			} else {
				Cart.create({
					total_sum: quantity * product.price,
					products_count: quantity,
					products: [{
						_id: product._id,
						quantity,
						sum: quantity * product.price,
					}],
				}, (err, cart) => {
					if (err) {
						res.status(500).end();
					} else {
						res.status(200).end();
					}
				});
			}
		})
	})
});

cart.route('/cart/:id')
.delete((req,res,next) => {
	Cart.find({}, (err, carts) => {
		if (err) {
			res.status(500).end();
			return;
		}
		let excludedProduct = null;
		let price = null;

		if (carts.length) {
			let cart = carts[0];
			let products = cart.products.filter((product) => {
				if (product._id !== +req.params.id) {
					return product;
				} else {
					if (product.quantity > 1) {
						price = product.sum / product.quantity;
						product.sum -= price;
						product.quantity -= 1;
						excludedProduct = product;
						return product;
					}
				}
				excludedProduct = true;
			});

			if (!excludedProduct) {
				res.status(400).end('No product with this id found.');
				return;
			}

			Cart.findByIdAndUpdate(cart._id, {
					$set: {
						total_sum: cart.total_sum - price,
						products_count: cart.products_count -  1,
						products,
					}
				}, (err, cart) => {
					if (err) {
						res.status(500).end();
					} else {
						res.status(200).end();
					}
				});
		} else {
			res.status(400).end('No product with this id found.');
		}
	})
})

module.exports = cart;
