import { Client, GatewayIntentBits } from "discord.js";
import ready from "./listeners/ready";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

ready(client);

client.login(process.env.BOT_TOKEN_TEST);
