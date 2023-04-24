import { ChannelType, Client, EmbedBuilder } from "discord.js";
import * as cron from "node-cron";
import cronCoffee from "./cronCoffee";
import blockchain from "./blockchain";
import dotenv from "dotenv";
dotenv.config();

const CHANNEL_ID_ALL_TEAMS = process.env.CHANNEL_ID_ALL_TEAMS;
const CHANNEL_ID_MONITORING = process.env.CHANNEL_ID_MONITORING;

export default (client: Client): void => {
  client.on("ready", async (c) => {
    if (!client.user || !client.application) {
      console.log("Error: Client.user or application is undefined");
      return;
    }

    console.log(`Logged in as ${client.user.tag}`);

    const channelCoffee = c.channels.cache.get(<string>CHANNEL_ID_ALL_TEAMS);
    const channelMonitoring = c.channels.cache.get(
      <string>CHANNEL_ID_MONITORING
    );

    if (!channelMonitoring || !channelCoffee) {
      console.log("Error: Channel Monitoring is undefined");
      return;
    }

    // listening to new event on genesis validator contract
    // and posting a message in the channel
    blockchain(channelMonitoring, client);

    // every Tuesday morning at 7am, a message will be posted in the
    // channel pairing members together
    // cron.schedule("*/5 * * * *", cronCoffee(channelCoffee));
    cron.schedule("0 7 * * TUE", cronCoffee(channelCoffee));
  });
};
