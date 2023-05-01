import { ChannelType, Client, GuildMember } from "discord.js";
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
    cron.schedule("*/2 * * * *", () => {
      console.log("Cron executed!");

      let memberArr: GuildMember[] = [];
      if (channelCoffee.type === ChannelType.GuildText) {
        channelCoffee.members
          .filter((member) => !member.user.bot)
          .each((member) => memberArr.push(member));

        if (memberArr.length < 2) {
          channelCoffee.send("There aren't enough members to pair up.");
          return;
        }

        // Shuffle the members and pair them up
        memberArr.sort((a, b) => Math.random() - 0.5);
        const pairs: string[] = [];

        memberArr.forEach((member, index) => {
          if (index % 2 === 0) {
            if (memberArr[index + 1] !== undefined) {
              pairs.push(`${member.user} with ${memberArr[index + 1].user}`);
            } else {
              pairs.push(`${member.user} will have a coffee with me 🤖`);
            }
          }
        });

        const intro =
          "Let's have random virtual coffee (or mate) to know each other better!\n\n☕️ Today's pairs are:\n\n";
        const outro = "\n\nYour favorite bot 🤖";
        const res = intro + pairs.join("\n") + outro;

        channelCoffee.send(res);
        return;
      } else {
        console.log("Error: Channel is not of type text");
      }
    });
  });
};
