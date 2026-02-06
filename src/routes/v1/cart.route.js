const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const cartValidation = require("../../validations/cart.validation");
const cartController = require("../../controllers/cart.controller");
const checkoutController = require("../../controllers/checkout.controller");

const router = express.Router();

// Cart APIs
router.get("/", auth, cartController.getCart);

router.post(
  "/",
  auth,
  validate(cartValidation.addProductToCart),
  cartController.addProductToCart
);

router.put(
  "/",
  auth,
  validate(cartValidation.updateProductInCart),
  cartController.updateCart
);


router.put("/checkout", auth, checkoutController.checkout);


router.delete("/:productId", auth, cartController.deleteProductFromCart);

module.exports = router;
