const Discord = require('discord.js');
const cron = require('node-cron');
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
  console.log("Waiting on cron to execute");
  cron.schedule('0 7 * * *', () => {
    console.log("Cron executed!");
    const channel = c.channels.cache.get(CHANNEL_ID);
    
    let memberArr = [];
    channel.members
      .filter(member => !member.user.bot)
      .each(member => memberArr.push(member));

    if (memberArr.size < 2) {
      channel.send("There aren't enough members to pair up.");
      return;
    }

    // Shuffle the members and pair them up
    memberArr.sort((a, b) => Math.random() - 0.5);
    const pairs = [];

    memberArr.forEach((member, index) => {
      console.log(member.user.username);
      if (index % 2 === 0) {
        if (memberArr[index+1] !== undefined) {
          pairs.push(`${member.user} with ${memberArr[index + 1].user}`);
        } else {
          pairs.push(`${member.user} will have a coffee with me 🤖`);
        }
      }
    });

    const intro = "Let's have a random virtual coffee!\n\☕️ Today's pairs are:\n\n";
    const outro = "\n\nYour favorite bot 🤖"
    const res = intro + pairs.join('\n') + outro;
    
    channel.send(res);    
  });
});


client.login(process.env.BOT_TOKEN);

// const channel = c.channels.cache.find(channel => channel.id === "1098257653244899378")

// client.on('ready', () => {

//   // Schedule the task to run once every day at midnight
//   // cron.schedule('0 0 * * *', () => {
    
// console.log(channel);
//     // Get all members in the channel that aren't bots
//     const members = channel.members.filter(member => !member.user.bot);

//     if (members.size < 2) {
//       channel.send("There aren't enough members to pair up.");
//       return;
//     }

//     // Shuffle the members and pair them up
//     const shuffled = members.random().shuffle();
//     const pairs = [];

//     shuffled.forEach((member, index) => {
//       if (index % 2 === 0) {
//         pairs.push(`${member} with ${shuffled[index + 1]}`);
//       }
//     });

//     if (pairs.length === 0) {
//       channel.send("There aren't enough members to pair up.");
//       return;
//     }

//     const intro = "Let's have a random virtual coffee! ☕️\n Today's pairs are:\n\n";
//     const res = intro + pairs.join('\n');
//     console.log(res);
    
//     channel.send(res);
//     process.exit(0);
//   // });
// });
