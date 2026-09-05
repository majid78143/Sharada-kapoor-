const { SlashCommandBuilder } = require("discord.js");
const api = require("../services/ffglory");
const { checkRequest } = require("../utils/cooldown");
const { errorEmbedData } = require("../utils/errors");
const { genericDataEmbed } = require("../utils/embeds");
const { PANEL_HOURS } = require("../constants/services");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("panelkey")
    .setDescription("VIP panel key generate kare")
    .addIntegerOption((option) => option.setName("hours").setDescription("Supported duration in hours").setRequired(true).addChoices(...PANEL_HOURS.map((hours) => ({ name: `${hours} hours`, value: hours })))),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    try {
      checkRequest(interaction.user.id, "panelkey");
      const result = await api.generatePanelKey(interaction.options.getInteger("hours"));
      await interaction.editReply({ embeds: [genericDataEmbed("🔑 PANEL KEY", result.data, 0x22c55e)] });
    } catch (error) {
      await interaction.editReply({ embeds: [errorEmbedData(error)] });
    }
  }
};