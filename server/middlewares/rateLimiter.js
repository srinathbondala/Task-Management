const rateLimit = require('express-rate-limit');

const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = 'Too many requests, please try again later.',
} = {}) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: 429,
      message,
    },
    keyGenerator: (req) => {
      return req.user?.id || req.ip;
    }
  });
};

module.exports = {
  createRateLimiter,
};
