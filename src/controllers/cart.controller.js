const httpStatus = require("http-status");
const { cartService } = require("../services");

const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCartByUser(req.user);
    res.status(httpStatus.OK).send(cart);
  } catch (err) {
    next(err);
  }
};

const addProductToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await cartService.addProductToCart(
      req.user,
      productId,
      quantity
    );
    res.status(httpStatus.CREATED).send(cart);
  } catch (err) {
    next(err);
  }
};

const updateCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await cartService.updateProductInCart(
      req.user,
      productId,
      quantity
    );

    if (!cart) {
      return res.status(httpStatus.NO_CONTENT).send();
    }

    res.status(httpStatus.OK).send(cart);
  } catch (err) {
    next(err);
  }
};

const deleteProductFromCart = async (req, res, next) => {
  try {
    await cartService.deleteProductFromCart(
      req.user,
      req.params.productId
    );
    res.status(httpStatus.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCart,
  addProductToCart,
  updateCart,
  deleteProductFromCart,
};
