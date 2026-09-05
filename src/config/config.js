const path = require("node:path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const required = ["DISCORD_TOKEN", "CLIENT_ID", "FFGLORY_API_KEY"];
const missing = required.filter((name) => !process.env[name]?.trim());

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variable(s): ${missing.join(", ")}. ` +
      "Copy .env.example to .env and fill in the values."
  );
}

const config = Object.freeze({
  discordToken: process.env.DISCORD_TOKEN.trim(),
  clientId: process.env.CLIENT_ID.trim(),
  guildId: process.env.GUILD_ID?.trim() || null,
  ffgloryBaseUrl: (process.env.FFGLORY_BASE_URL || "https://ff-glory.xyz").replace(/\/+$/, ""),
  ffgloryApiKey: process.env.FFGLORY_API_KEY.trim(),
  apiTimeoutMs: Number(process.env.FFGLORY_TIMEOUT_MS || 15000)
});

module.exports = { config };
