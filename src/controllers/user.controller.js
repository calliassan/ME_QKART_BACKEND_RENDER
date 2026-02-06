const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");

const getUser = catchAsync(async (req, res) => {
  if (req.user._id.toString() !== req.params.userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "User not found");
  }

  if (req.query.q === "address") {
    const user = await userService.getUserAddressById(req.params.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    return res.send({ address: user.address });
  }

  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  res.send(user);
});

const setAddress = catchAsync(async (req, res) => {
  if (req.user._id.toString() !== req.params.userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "User not authorized");
  }

  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const address = await userService.setAddress(user, req.body.address);
  res.send({ address });
});

module.exports = {
  getUser,
  setAddress,
};
