import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import app from "../src/app";

// For serverless, we don't run seedSuperAdmin on every invocation
// Run it manually once or use a separate migration script

// Export the Express app as a serverless function
export default app;
