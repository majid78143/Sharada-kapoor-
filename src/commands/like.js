const { SlashCommandBuilder } = require("discord.js");
const api = require("../services/ffglory");
const { checkRequest } = require("../utils/cooldown");
const { errorEmbedData } = require("../utils/errors");
const { likeEmbed } = require("../utils/embeds");
const { REGIONS } = require("../constants/services");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("like")
    .setDescription("Instant profile likes order kare")
    .addStringOption((option) => option.setName("uid").setDescription("Free Fire UID").setRequired(true))
    .addStringOption((option) => option.setName("region").setDescription("Server region").setRequired(false).addChoices(...REGIONS.map((region) => ({ name: region, value: region })))),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    try {
      const uid = interaction.options.getString("uid");
      const region = interaction.options.getString("region") || "IND";
      checkRequest(interaction.user.id, "like");
      const result = await api.instantLikes(uid, region);
      await interaction.editReply({ embeds: [likeEmbed(result.data)] });
    } catch (error) {
      await interaction.editReply({ embeds: [errorEmbedData(error)] });
    }
  }
};