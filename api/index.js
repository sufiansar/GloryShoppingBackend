"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("../src/app"));
// For serverless, we don't run seedSuperAdmin on every invocation
// Run it manually once or use a separate migration script
// Export the Express app as a serverless function
exports.default = app_1.default;
