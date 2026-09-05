const { SlashCommandBuilder } = require("discord.js");
const api = require("../services/ffglory");
const { errorEmbedData } = require("../utils/errors");
const { genericDataEmbed } = require("../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder().setName("account").setDescription("Live reseller account details dekhein"),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    try {
      const result = await api.getAccount();
      await interaction.editReply({ embeds: [genericDataEmbed("👤 ACCOUNT", result.data)] });
    } catch (error) {
      await interaction.editReply({ embeds: [errorEmbedData(error)] });
    }
  }
};
