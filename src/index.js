console.log("ENV MONGODB_URL =", process.env.MONGODB_URL);
console.log("ENV NODE_ENV =", process.env.NODE_ENV);

const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger"); 
console.log("CONFIG MONGODB URL =", config.mongoose.url);

mongoose
  .connect(encodeURI(config.mongoose.url), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    logger.info("Connected to MongoDB");
    app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  })
  .catch((err) => {
    logger.error(err);
  });


