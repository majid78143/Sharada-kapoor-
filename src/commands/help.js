const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("FF GLORY bot commands ki list dikhaye"),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x7c3aed)
      .setTitle("FF GLORY commands")
      .setDescription("Mobile-friendly reseller controls")
      .addFields(
        { name: "Panel", value: "`/panel` — buttons ke saath main control panel", inline: false },
        { name: "Services", value: "`/like` ` /glory` ` /autolike` ` /panelkey`", inline: false },
        { name: "Account", value: "`/balance` ` /account` ` /orders` ` /groups`", inline: false },
        { name: "Health", value: "`/ping` — bot response check", inline: false }
      )
      .setFooter({ text: "Paid requests timeout par automatically retry nahi hote." });
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};