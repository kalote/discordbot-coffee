import { REST, Routes } from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const { CLIENT_ID, SERVER_ID, BOT_TOKEN } = process.env;

const commands = [];
// Grab all the command files from the commands directory
const foldersPath = path.join(__dirname, "../", "commands");
const commandFiles = readdirSync(foldersPath).filter((file) =>
  file.endsWith(".ts")
);
for (const file of commandFiles) {
  const filePath = path.join(foldersPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(<string>BOT_TOKEN);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(<string>CLIENT_ID, <string>SERVER_ID),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${(data as any).length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
