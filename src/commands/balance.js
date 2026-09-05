const { SlashCommandBuilder } = require("discord.js");
const api = require("../services/ffglory");
const { errorEmbedData } = require("../utils/errors");
const { genericDataEmbed } = require("../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder().setName("balance").setDescription("Live wallet balance dekhein"),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    try {
      const result = await api.getBalance();
      await interaction.editReply({ embeds: [genericDataEmbed("💰 WALLET", result.data)] });
    } catch (error) {
      await interaction.editReply({ embeds: [errorEmbedData(error)] });
    }
  }
};