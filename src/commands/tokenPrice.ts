import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("price")
  .setDescription("Retrieve current LYX token price");

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.reply("reply");
};
