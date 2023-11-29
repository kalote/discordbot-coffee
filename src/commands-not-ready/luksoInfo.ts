import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("lukso-info")
  .setDescription("Get info about LUKSO ecosystem")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("price")
      .setDescription("Retrieve current LYX token price")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("docs")
      .setDescription("Link to the technical documentation")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("standards")
      .setDescription("Link to the LUKSO standards")
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  if (interaction.options.getSubcommand() === "price") {
    const tokenId = "lukso-token-2";
    const currency = "usd";
    const apiCall = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=${currency}`
    );
    const dataJson = await apiCall.json();

    console.log(dataJson);
    await interaction.reply(`LYX price is **$${dataJson[tokenId][currency]}**`);
  } else if (interaction.options.getSubcommand() === "docs") {
    const text = "Here is the link: <https://docs.lukso.tech/>";
    await interaction.reply(text);
  } else if (interaction.options.getSubcommand() === "standards") {
    const text =
      "Here is the link: <https://github.com/lukso-network/LIPs/tree/main/LSPs>";
    await interaction.reply(text);
  }
};
