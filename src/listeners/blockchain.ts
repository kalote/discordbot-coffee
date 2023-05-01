import { ethers } from "ethers";
import { Channel, ChannelType, Client, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";
import luksoABI from "../abi/LuksoGenesis.json";
import USDTAbi from "../abi/USDTAbi.json";
dotenv.config();

const luksoAddress = "0x42000421dd80D1e90E56E87e6eE18D7770b9F8cC";
const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

export default async (channel: Channel, client: Client): Promise<void> => {
  console.log("Listening on contract events ...");
  let count = parseInt(<string>process.env.COUNT);
  const provider = new ethers.providers.WebSocketProvider(
    `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_ID}`
  );
  const contract = new ethers.Contract(usdtAddress, USDTAbi, provider);

  contract.on("Transfer", (from, to, value, event) => {
    // contract.on(
    //   "DepositEvent(bytes,bytes,uint256,bytes,uint256)",
    //   (pubkey, withdrawal_credentials, amount, signature, index, event) => {
    console.log("New Transfer!");
    if (!client.user || !client.application) {
      console.log("Error: Client.user or application is undefined");
      return;
    }
    count += 1;
    const lyxeStaked = count * 32;
    const targetCompletion = ((count * 100) / 4096).toFixed(2);

    // const embed = new EmbedBuilder()
    //   .setColor(0x41b983)
    //   .setTitle("A new Genesis Validator joined 🔥")
    //   .setAuthor({
    //     name: client.user.username,
    //     iconURL: client.user.displayAvatarURL(),
    //   })
    //   .setDescription(
    //     `A new validator joined the LUKSO adventure at block \`${event.blockNumber}\` !`
    //   )
    //   .addFields(
    //     { name: "Validator Count", value: `${count}`, inline: true },
    //     { name: "LYXe Staked", value: `${lyxeStaked} LYXe`, inline: true },
    //     {
    //       name: "Target completion",
    //       value: `${targetCompletion}%`,
    //       inline: true,
    //     }
    //   );
    if (channel.type == ChannelType.GuildText) {
      channel.send(
        `A new transfer happened on USDT contract \`${event.blockNumber}\` 🎉🎉🎉!`
      );
      // channel.send({ embeds: [embed] });
    }
    console.log(JSON.stringify(event, null, 4));
  });
};
