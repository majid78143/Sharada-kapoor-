const { SlashCommandBuilder } = require("discord.js");
const api = require("../services/ffglory");
const { checkRequest } = require("../utils/cooldown");
const { errorEmbedData } = require("../utils/errors");
const { genericDataEmbed } = require("../utils/embeds");
const { REGIONS } = require("../constants/services");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("glory")
    .setDescription("Guild Glory launch kare")
    .addStringOption((option) => option.setName("guild_uid").setDescription("Numeric guild UID").setRequired(true))
    .addStringOption((option) => option.setName("region").setDescription("Server region").setRequired(false).addChoices(...REGIONS.map((region) => ({ name: region, value: region })))),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    try {
      checkRequest(interaction.user.id, "glory");
      const result = await api.launchGuild(
        interaction.options.getString("guild_uid"),
        interaction.options.getString("region") || "IND"
      );
      await interaction.editReply({ embeds: [genericDataEmbed("🤖 GUILD GLORY", result.data, 0x22c55e)] });
    } catch (error) {
      await interaction.editReply({ embeds: [errorEmbedData(error)] });
    }
  }
};