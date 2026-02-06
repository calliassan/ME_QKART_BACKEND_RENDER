const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    paymentOption: {
      type: String,
      default: "PAYMENT_OPTION_DEFAULT",
    },
    cartItems: [
      {
        product: {
          type: Object,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    cartTotal: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: false }
);

// ✅ THIS IS THE KEY FIX
cartSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.cartTotal;
    return ret;
  },
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = { Cart };
