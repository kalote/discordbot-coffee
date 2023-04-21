const Discord = require('discord.js');
const cron = require('node-cron');
const { cronFn } = require("./cronCoffee");
const { blockchainFn } = require("./blockchain");
require('dotenv').config();

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMessageTyping,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildPresences,
  ]
});

const CHANNEL_ID = process.env.CHANNEL_ID;

client.on('ready', async (c) => {
  console.log(`Logged in as ${client.user.tag}`);
  
  const channel = c.channels.cache.get(CHANNEL_ID);

  // listening to new event on genesis validator contract
  // and posting a message in the channel
  blockchainFn(channel);
  
  // every morning at 7am, a message will be posted in the
  // channel pairing members together
  cron.schedule('0 7 * * *', cronFn(channel));
});


client.login(process.env.BOT_TOKEN);
