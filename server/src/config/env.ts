import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || "5000", 10),
  mongodbUri: process.env.MONGODB_URI || "",
  redisUrl: process.env.REDIS_URL || "",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV || "development",
};

export const validateEnv = (): void => {
  const required = ["MONGODB_URI", "REDIS_URL", "GEMINI_API_KEY"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};
