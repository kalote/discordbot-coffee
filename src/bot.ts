import { readdirSync } from "fs";
import path from "path";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import ready from "./listeners/ready";
import events from "./listeners/events";
import { ClientWithCommands } from "additional";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
}) as ClientWithCommands;

client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFiles = readdirSync(foldersPath).filter((file) =>
  file.endsWith(".ts")
);
for (const file of commandFiles) {
  const filePath = path.join(foldersPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

ready(client);
events(client);

client.login(process.env.BOT_TOKEN_TEST);
