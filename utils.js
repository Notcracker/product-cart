module.exports = {
  transform: function(schema) {
    schema.set('toJSON', {
         transform: function (doc, ret, options) {
             ret.id = ret._id;
             delete ret._id;
             delete ret.__v;
         }
    });
  },
  makeErrorMessage: function(type) {
    let errors = {
      product_id: {
        "code":"required",
        "message":"Product cannot be blank.",
        "name":"product_id"
      },
      quantity: {
        "code":"required",
        "message":"Quantity cannot be blank.",
        "name":"quantity"
      },
      invalid: {
        "type":"invalid_param_error",
        "message":"Invalid data parameters"
      }
    };

    return {error: errors[type]};
  }
};
