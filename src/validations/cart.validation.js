const Joi = require("joi");

const addProductToCart = {
  body: Joi.object().keys({
    productId: Joi.string().required(),
    quantity: Joi.number().required().min(1),
  }),
};

const updateProductInCart = {
  body: Joi.object().keys({
    productId: Joi.string().required(),
    quantity: Joi.number().required().min(0),
  }),
};

module.exports = {
  addProductToCart,
  updateProductInCart,
};
