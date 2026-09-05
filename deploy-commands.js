const { REST, Routes } = require("discord.js");
const { config } = require("./config/config");
const { logger } = require("./utils/logger");
const fs = require("node:fs");
const path = require("node:path");

const commandDirectory = path.join(__dirname, "commands");
const commands = [];
for (const file of fs.readdirSync(commandDirectory).filter((name) => name.endsWith(".js"))) {
  const command = require(path.join(commandDirectory, file));
  if (command.data) commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(config.discordToken);
const route = config.guildId
  ? Routes.applicationGuildCommands(config.clientId, config.guildId)
  : Routes.applicationCommands(config.clientId);

(async () => {
  try {
    logger.info("Deploying slash commands", { count: commands.length, scope: config.guildId ? "guild" : "global" });
    await rest.put(route, { body: commands });
    logger.info("Slash commands deployed successfully");
  } catch (error) {
    logger.error("Slash command deployment failed", { message: error.message });
    process.exitCode = 1;
  }
})();