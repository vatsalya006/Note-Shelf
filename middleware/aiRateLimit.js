const rateLimit = require("express-rate-limit");

const aiRateLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 10, // Maximum 10 requests per minute per IP
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        message: "Too many AI requests. Please wait a minute and try again."
    }
});

module.exports = aiRateLimit;