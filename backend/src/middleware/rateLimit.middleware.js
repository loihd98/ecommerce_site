import rateLimit from "express-rate-limit";
import { config } from "../config/config.js";

// Whitelisted IPs (admin/development IPs that bypass rate limiting)
const WHITELISTED_IPS = [
  "127.0.0.1",
  "::1",
  "::ffff:127.0.0.1",
  // Add your IP here if needed
];

// Skip function for whitelisted IPs
const skipWhitelistedIPs = (req) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  return WHITELISTED_IPS.includes(clientIP);
};

// General rate limiter - TEMPORARILY DISABLED
export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: 999999, // Temporarily disabled
  message: {
    success: false,
    message: "Too many requests, please try again later",
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => true, // Skip all requests temporarily
});

// Auth rate limiter (stricter) - TEMPORARILY DISABLED
export const authRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: 999999, // Temporarily disabled
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later",
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skip: () => true, // Skip all requests temporarily
});

// Payment rate limiter
export const paymentRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: config.nodeEnv === "production" ? 10 : 100, // Increased from 3 to 10 for production
  message: {
    success: false,
    message: "Too many payment attempts, please try again later",
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipWhitelistedIPs,
});
