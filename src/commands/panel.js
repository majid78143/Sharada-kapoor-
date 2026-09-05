const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder
} = require("discord.js");
const api = require("../services/ffglory");
const { panelEmbed } = require("../utils/embeds");
const { errorEmbedData } = require("../utils/errors");

function panelComponents() {
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("panel_like").setLabel("Likes").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("panel_glory").setLabel("Glory").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("panel_autolike").setLabel("Auto-Likes").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("panel_key").setLabel("Keys").setStyle(ButtonStyle.Primary)
    ),
    new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("panel_balance").setLabel("Balance").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("panel_orders").setLabel("Orders").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("panel_groups").setLabel("Groups").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("panel_account").setLabel("Account").setStyle(ButtonStyle.Secondary)
    ),
    new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("panel_service")
        .setPlaceholder("Service choose karein")
        .addOptions(
          { label: "Instant Likes", value: "like" },
          { label: "Guild Glory", value: "glory" },
          { label: "Daily Auto-Likes", value: "autolike" },
          { label: "Panel Key", value: "panelkey" }
        )
    )
  ];
}

module.exports = {
  data: new SlashCommandBuilder().setName("panel").setDescription("FF GLORY reseller control panel khole"),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    try {
      const [accountResult, balanceResult] = await Promise.all([api.getAccount(), api.getBalance()]);
      await interaction.editReply({
        embeds: [panelEmbed(interaction.user.toString(), accountResult.data, balanceResult.data)],
        components: panelComponents()
      });
    } catch (error) {
      await interaction.editReply({ embeds: [errorEmbedData(error)], components: [] });
    }
  },
  panelComponents
};