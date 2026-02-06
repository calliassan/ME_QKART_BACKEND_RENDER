const httpStatus = require("http-status");
const { Cart } = require("../models");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");

const checkout = async (user) => {
  const cart = await Cart.findOne({ email: user.email });

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }

  if (cart.cartItems.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cart is empty");
  }

  // ✅ FINAL address check (Crio expected)
  if (!user.address || user.address === config.default_address) {
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

module.exports = { checkout };
