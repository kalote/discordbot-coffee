import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("user")
  .setDescription("Provides information about the user.");

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.reply(
    `This command was run by ${
      interaction.user.username
    }, with info ${interaction?.member?.toString()}.`
  );
};
