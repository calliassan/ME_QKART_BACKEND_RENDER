const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../config/config");
const { tokenTypes } = require("../config/tokens");

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires,
    type,
  };

  return jwt.sign(payload, secret);
};

const generateAuthTokens = async (user) => {
  const expires = moment()
    .add(config.jwt.accessExpirationMinutes, "minutes")
    .unix();

  return {
    access: {
      token: generateToken(user._id, expires, tokenTypes.ACCESS),
      expires: moment.unix(expires).toDate(),
    },
  };
};

module.exports = {
  generateToken,
  generateAuthTokens,
};
