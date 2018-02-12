let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let	assert = require('assert');

let product = express.Router();
let Product = require('../models/product');

product.use(bodyParser.json());
product.route('/products')
.get((req,res,next) =>{
	Product.find({}, (err, products) => {
		if (err) throw err;
		res.json(products);
	})
})
.post((req,res,next) => {
	let {name, description, price} = req.body;

	Product.create({ name, description, price }, (err,task) => {
		if (err) throw err;

		res.json(task);
	});
})

module.exports = product;
