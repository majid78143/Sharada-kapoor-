const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");
const api = require("../services/ffglory");
const { errorEmbedData } = require("../utils/errors");
const { groupsEmbed } = require("../utils/embeds");

function actionMenu(userId, groups) {
  const options = groups.slice(0, 5).flatMap((group) => [
    { label: `Restart ${group.guild_name || group.group_id}`, value: `restart|${group.group_id}` },
    { label: `Stop ${group.guild_name || group.group_id}`, value: `stop|${group.group_id}` },
    { label: `Delete ${group.guild_name || group.group_id}`, value: `delete|${group.group_id}` },
    { label: `Get glory ${group.guild_name || group.group_id}`, value: `get-glory|${group.group_id}` },
    { label: `Clan info ${group.guild_name || group.group_id}`, value: `get-clan-info|${group.group_id}` }
  ]).slice(0, 25);
  if (!options.length) return [];
  return [new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`group_action:${userId}`)
      .setPlaceholder("Guild action select karein")
      .addOptions(options)
  )];
}

module.exports = {
  data: new SlashCommandBuilder().setName("groups").setDescription("Active guild groups aur actions dekhein"),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    try {
      const result = await api.getGuildGroups();
      const groups = result.data?.groups || [];
      await interaction.editReply({ embeds: [groupsEmbed(groups)], components: actionMenu(interaction.user.id, groups) });
    } catch (error) {
      await interaction.editReply({ embeds: [errorEmbedData(error)] });
    }
  },
  async handleAction(interaction, value) {
    const [action, groupId] = value.split("|");
    if (action === "delete") {
      await interaction.update({
        content: `Delete confirmation: **${groupId}** permanently delete hoga. Confirm karein.`,
        embeds: [],
        components: [
          new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId(`group_delete_confirm:${interaction.user.id}:${groupId}`)
                .setLabel("Confirm delete")
                .setStyle(ButtonStyle.Danger),
              new ButtonBuilder()
                .setCustomId(`group_delete_cancel:${interaction.user.id}`)
                .setLabel("Cancel")
                .setStyle(ButtonStyle.Secondary)
          )
        ]
      });
      return;
    }
    await interaction.deferUpdate();
    try {
      const result = await api.guildAction(groupId, action);
      await interaction.editReply({ embeds: [groupsEmbed([result.data])], components: [] });
    } catch (error) {
      await interaction.editReply({ embeds: [errorEmbedData(error)], components: [] });
    }
  },
  async confirmDelete(interaction, groupId) {
    await interaction.deferUpdate();
    try {
      const result = await api.guildAction(groupId, "delete");
      await interaction.editReply({ content: "Guild group delete request complete hua.", embeds: [groupsEmbed([result.data])], components: [] });
    } catch (error) {
      await interaction.editReply({ embeds: [errorEmbedData(error)], components: [] });
    }
  }
};