const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Load .env if present and env var not already set
const envPath = path.resolve(process.cwd(), ".env");
if (!process.env.MONGODB_URI && fs.existsSync(envPath)) {
  const raw = fs.readFileSync(envPath, "utf8");
  raw.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) return;
    const key = m[1];
    let val = m[2];
    // strip surrounding quotes
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  });
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI not set. Export it or create a .env file.");
  process.exit(1);
}

console.log("Attempting to connect to MongoDB...");

mongoose
  .connect(uri, { bufferCommands: false })
  .then(() => {
    console.log("✅ Successfully connected to MongoDB");
    return mongoose.connection.close();
  })
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Connection failed:", err.message || err);
    process.exit(2);
  });
