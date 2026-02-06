const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { checkoutService } = require("../services");

const checkout = catchAsync(async (req, res) => {
  await checkoutService.checkout(req.user);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  checkout,
};
