const dotenv = require("dotenv");
const path = require("path");

const envFile = process.env.NODE_ENV === "production" 
  ? ".env.production"
  : ".env.development";

dotenv.config({ path: path.join(__dirname, envFile) });

console.log(`Loaded environment: ${envFile}`);
