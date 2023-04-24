import { ethers } from "ethers";
import { Channel, ChannelType, Client, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";
import luksoABI from "../abi/LuksoGenesis.json";
dotenv.config();

const luksoAddress = "0x42000421dd80D1e90E56E87e6eE18D7770b9F8cC";

export default async (channel: Channel, client: Client): Promise<void> => {
  console.log("Listening on contract events ...");
  let count = parseInt(<string>process.env.COUNT);
  const provider = new ethers.providers.WebSocketProvider(
    `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_ID}`
  );
  const contract = new ethers.Contract(luksoAddress, luksoABI, provider);

  contract.on(
    "DepositEvent(bytes,bytes,uint256,bytes,uint256)",
    (pubkey, withdrawal_credentials, amount, signature, index, event) => {
      console.log("New Deposit! (signature)");
      if (!client.user || !client.application) {
        console.log("Error: Client.user or application is undefined");
        return;
      }
      count += 1;
      const lyxeStaked = count * 32;
      const targetCompletion = ((count * 100) / 4096).toFixed(2);

      const embed = new EmbedBuilder()
        .setColor(0x41b983)
        .setTitle("A new Genesis Validator joined 🔥")
        .setURL("https://deposit.mainnet.lukso.network/en/")
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL(),
        })
        .setDescription(
          `A new validator joined the LUKSO adventure at block \`${event.blockNumber}\` !`
        )
        .addFields(
          { name: "Validator Count", value: `${count}`, inline: true },
          { name: "LYXe Staked", value: `${lyxeStaked} LYXe`, inline: true },
          {
            name: "Target completion",
            value: `${targetCompletion}%`,
            inline: true,
          }
        );
      // channel.send(`A new validator joined the LUKSO adventure at block \`${event.blockNumber}\` 🎉🎉🎉!\nWe now have ${count} validators (${count*32} LYXe) which represents ${(count*100/4096).toFixed(2)}% of our target!`);
      if (channel.type == ChannelType.GuildText) {
        channel.send({ embeds: [embed] });
      }
      console.log(JSON.stringify(event, null, 4));
    }
  );

  const filter = {
    address: luksoAddress,
    topics: [
      ethers.utils.id("DepositEvent(bytes,bytes,uint256,bytes,uint256)"),
    ],
  };

  provider.on(filter, (log, event) => {
    console.log("New Deposit! (provider)", event);
  });
};
