const httpStatus = require("http-status");
const { Cart, Product } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * GET CART BY USER
 */
const getCartByUser = async (user) => {
  const cart = await Cart.findOne({ email: user.email });

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }

  return cart;
};

/**
 * ADD PRODUCT TO CART
 */
const addProductToCart = async (user, productId, quantity) => {
  // 1️⃣ Validate product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not found");
  }

  // 2️⃣ Find cart
  let cart = await Cart.findOne({ email: user.email });

  // 3️⃣ Create cart if not exists
  if (!cart) {
    cart = await Cart.create({
      email: user.email,
      cartItems: [],
      paymentOption: "PAYMENT_OPTION_DEFAULT",
    });

    // 🔥 Required for unit test: return 500 if cart creation fails
    if (!cart) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create cart"
      );
    }
  }

  // 4️⃣ Check duplicate product
  const exists = cart.cartItems.find(
    (item) => item.product._id.toString() === product._id.toString()
  );

  if (exists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product already in cart");
  }

  // 5️⃣ Push full product object
  cart.cartItems.push({
    product,
    quantity,
  });

  await cart.save();
  return cart;
};

/**
 * UPDATE PRODUCT IN CART
 */
const updateProductInCart = async (user, productId, quantity) => {
  const cart = await Cart.findOne({ email: user.email });

  if (!cart) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cart not found");
  }

  const index = cart.cartItems.findIndex(
    (item) => item.product._id.toString() === productId.toString()
  );

  if (index === -1) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart");
  }

  // Quantity 0 → delete product
  if (quantity === 0) {
    cart.cartItems.splice(index, 1);
    await cart.save();
    return null;
  }

  cart.cartItems[index].quantity = quantity;
  await cart.save();

  return cart;
};

/**
 * DELETE PRODUCT FROM CART
 */
const deleteProductFromCart = async (user, productId) => {
  const cart = await Cart.findOne({ email: user.email });

  if (!cart) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cart not found");
  }

  const index = cart.cartItems.findIndex(
    (item) => item.product._id.toString() === productId.toString()
  );

  if (index === -1) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart");
  }

  cart.cartItems.splice(index, 1);
  await cart.save();
};

/**
 * CHECKOUT CART
 */
const checkout = async (user) => {
  const cart = await Cart.findOne({ email: user.email });

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }

  if (cart.cartItems.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cart is empty");
  }

  if (!user.hasSetNonDefaultAddress()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Address not set");
  }

  let totalCost = 0;
  cart.cartItems.forEach((item) => {
    totalCost += item.product.cost * item.quantity;
  });

  if (user.walletMoney < totalCost) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient wallet balance");
  }

  user.walletMoney -= totalCost;
  await user.save();

  cart.cartItems = [];
  await cart.save();
};

module.exports = {
  getCartByUser,
  addProductToCart,
  updateProductInCart,
  deleteProductFromCart,
  checkout,
};
