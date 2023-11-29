import { Client } from "discord.js";
import * as cron from "node-cron";
import cronCoffee from "../cron/cronCoffee";
import cronLunch from "../cron/cronLunch";
import dotenv from "dotenv";
dotenv.config();

const { CHANNEL_ID_ALL_TEAMS, CHANNEL_ID_BERLIN_TEAM } = process.env;

export default (client: Client): void => {
  client.on("ready", async (c) => {
    if (!client.user || !client.application) {
      console.log("Error: Client.user or application is undefined");
      return;
    }

    console.log(`Logged in as ${client.user.tag}`);

    const channelCoffee = c.channels.cache.get(<string>CHANNEL_ID_ALL_TEAMS);
    const channelLunch = c.channels.cache.get(<string>CHANNEL_ID_BERLIN_TEAM);

    if (!channelCoffee) {
      console.log("Error: Channel All Teams is undefined");
      return;
    }

    if (!channelLunch) {
      console.log("Error: Channel Berlin-team is undefined");
      return;
    }

    // every Tuesday morning at 10am, a message will be posted in the all-teams
    // channel pairing members together for a coffee
    cron.schedule("0 9 * * TUE", cronCoffee(channelCoffee));
    // cron.schedule("*/5 * * * *", cronCoffee(channelCoffee));

    // every Thursday at 3pm, a message will be posted in the berlin-team
    // channel reminding the team to set up their lunch preference for next week
    cron.schedule("0 14 * * THU", cronLunch(channelLunch));
    // cron.schedule("* * * * *", cronLunch(channelLunch));
  });
};
