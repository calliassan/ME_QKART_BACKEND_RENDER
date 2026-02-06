const Joi = require("joi");
const { objectId } = require("./custom.validation");

/**
 * GET /v1/users/:userId
 */
const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
};

/**
 * PUT /v1/users/:userId
 */
const setAddress = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    address: Joi.string().required().min(20),
  }),
};

module.exports = {
  getUser,
  setAddress,
};
