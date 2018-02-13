let arrayOfProducts = [
    { name: 'cherry',
      description: `Cherry wood is valued for its rich color and straight grain in manufacturing fine furniture, particularly desks, tables and chairs`,
      price: 60,
    },
    { name: 'strawbbery',
      description: `Modern strawberries have complex octaploid genetics (8 sets of chromosomes), a trait favoring DNA extractions.`,
      price: 70,
    },
    { name: 'blueberry',
      description: `Blueberry wine is made from the flesh and skin of the berry, which is fermented and then matured; usually the lowbush variety is used.`,
      price: 80,
    },
   {
     name: 'watermelon',
     description: `The more than 1200[14] cultivars of watermelon range in weight from less than 1 kg to more than 90 kilograms (200 lb); the flesh can be red, pink, orange, yellow or white.`,
     price: 90,
   }
 ];

function setupServer(db, callback) {
  db.dropDatabase((err, result) => {
    if (err) throw err;

    setTimeout(()=> {
      let Product = require('./models/product');
      let Cart = require('./models/cart');

      Product.create(arrayOfProducts, (err,task) => {
    		if (err) throw err;
        callback();
    	});
    }, 3000);
  });
}

module.exports = setupServer;
