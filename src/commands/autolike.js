const { SlashCommandBuilder } = require("discord.js");
const api = require("../services/ffglory");
const { checkRequest } = require("../utils/cooldown");
const { errorEmbedData } = require("../utils/errors");
const { genericDataEmbed } = require("../utils/embeds");
const { AUTO_LIKE_DAYS, REGIONS } = require("../constants/services");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autolike")
    .setDescription("Daily auto-likes subscription banaye")
    .addStringOption((option) => option.setName("uid").setDescription("Free Fire UID").setRequired(true))
    .addIntegerOption((option) => option.setName("days").setDescription("15 ya 30 days").setRequired(true).addChoices(...AUTO_LIKE_DAYS.map((days) => ({ name: `${days} days`, value: days }))))
    .addStringOption((option) => option.setName("region").setDescription("Server region").setRequired(false).addChoices(...REGIONS.map((region) => ({ name: region, value: region })))),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    try {
      checkRequest(interaction.user.id, "autolike");
      const result = await api.createAutoLike(
        interaction.options.getString("uid"),
        interaction.options.getInteger("days"),
        interaction.options.getString("region") || "IND"
      );
      await interaction.editReply({ embeds: [genericDataEmbed("🔄 DAILY AUTO-LIKES", result.data, 0x22c55e)] });
    } catch (error) {
      await interaction.editReply({ embeds: [errorEmbedData(error)] });
    }
  }
};