const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const { config } = require("./config/config");
const { logger } = require("./utils/logger");
const { handleButton, handleModal } = require("./interactions/buttons");
const { handleSelectMenu } = require("./interactions/selectMenus");
const { toPublicError } = require("./utils/errors");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel]
});
client.commands = new Collection();

const commandDirectory = path.join(__dirname, "commands");
for (const file of fs.readdirSync(commandDirectory).filter((name) => name.endsWith(".js"))) {
  const command = require(path.join(commandDirectory, file));
  if (command.data?.name && command.execute) client.commands.set(command.data.name, command);
}

client.once("ready", (readyClient) => {
  logger.info("Discord bot ready", { user: readyClient.user.tag, commands: client.commands.size });
  readyClient.user.setActivity("FF GLORY reseller panel", { type: 3 });
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      logger.info("Command received", { command: interaction.commandName, userId: interaction.user.id });
      await command.execute(interaction);
      return;
    }
    if (interaction.isButton()) {
      await handleButton(interaction);
      return;
    }
    if (interaction.isModalSubmit()) {
      await handleModal(interaction);
      return;
    }
    if (interaction.isStringSelectMenu()) {
      await handleSelectMenu(interaction);
    }
  } catch (error) {
    const publicError = toPublicError(error);
    logger.error("Interaction handler failed", { message: error.message });
    const payload = { content: `⚠️ ${publicError.message}`, ephemeral: true };
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp(payload).catch(() => undefined);
    } else {
      await interaction.reply(payload).catch(() => undefined);
    }
  }
});

process.on("unhandledRejection", (error) => {
  logger.error("Unhandled promise rejection", { message: error?.message || String(error) });
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", { message: error.message });
  process.exit(1);
});

logger.info("Starting Discord bot");
client.login(config.discordToken).catch((error) => {
  logger.error("Discord login failed", { message: error.message });
  process.exit(1);
});