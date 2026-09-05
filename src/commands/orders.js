const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const api = require("../services/ffglory");
const { errorEmbedData } = require("../utils/errors");
const { ordersEmbed } = require("../utils/embeds");

const PAGE_SIZE = 5;
const orderSessions = new Map();

function controls(userId, page, totalPages) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`orders_prev:${userId}`).setLabel("Previous").setStyle(ButtonStyle.Secondary).setDisabled(page <= 0),
    new ButtonBuilder().setCustomId(`orders_next:${userId}`).setLabel("Next").setStyle(ButtonStyle.Secondary).setDisabled(page >= totalPages - 1),
    new ButtonBuilder().setCustomId(`orders_refresh:${userId}`).setLabel("Refresh").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId(`orders_close:${userId}`).setLabel("Close").setStyle(ButtonStyle.Danger)
  );
}

async function loadOrders(interaction, page = 0) {
  const result = await api.getOrders();
  const orders = result.data?.orders || [];
  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(page, 0), totalPages - 1);
  orderSessions.set(interaction.user.id, { orders, page: safePage });
  return {
    embeds: [ordersEmbed(orders, safePage, PAGE_SIZE)],
    components: [controls(interaction.user.id, safePage, totalPages)]
  };
}

module.exports = {
  data: new SlashCommandBuilder().setName("orders").setDescription("Orders history with pagination dekhein"),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    try {
      await interaction.editReply(await loadOrders(interaction));
    } catch (error) {
      await interaction.editReply({ embeds: [errorEmbedData(error)] });
    }
  },
  async handleButton(interaction, action) {
    if (action.userId !== interaction.user.id) {
      await interaction.reply({ content: "Ye orders panel kisi aur user ka hai.", ephemeral: true });
      return;
    }
    if (action.type === "close") {
      orderSessions.delete(interaction.user.id);
      await interaction.update({ content: "Orders panel closed.", embeds: [], components: [] });
      return;
    }
    await interaction.deferUpdate();
    try {
      const session = orderSessions.get(interaction.user.id);
      const page = action.type === "refresh" ? session?.page || 0 : (session?.page || 0) + (action.type === "next" ? 1 : -1);
      await interaction.editReply(await loadOrders(interaction, page));
    } catch (error) {
      await interaction.editReply({ embeds: [errorEmbedData(error)], components: [] });
    }
  }
};