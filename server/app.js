import express from "express";
import cors from "cors";
import xssClean from "xss-clean";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Parse incoming requests with JSON payloads and set a size limit of 16KB
app.use(express.json({ limit: "16kb" }));

// Parse cookies from the request headers and make them accessible in req.cookies
app.use(cookieParser());

// Use Helmet middleware for basic security headers
app.use(helmet());

// XSS protection middleware
app.use(xssClean());

// Error handling middleware 
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors
    });
  }

  // Fallback for unhandled errors
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

export { app };
