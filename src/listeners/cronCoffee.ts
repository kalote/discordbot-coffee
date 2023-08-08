import { Channel, ChannelType, GuildMember } from "discord.js";

export default (channel: Channel): (() => void) => {
  return () => {
    console.log("Cron executed!");

    let memberArr: GuildMember[] = [];
    if (channel.type === ChannelType.GuildText) {
      channel.members
        .filter((member) => !member.user.bot) // remove bots
        .filter((member) => member.user.tag !== "cryptochic#9612") // remove sarah
        .filter((member) => member.user.tag !== "paolasoto#2297") // remove paola
        .each((member) => memberArr.push(member));

      if (memberArr.length < 2) {
        channel.send("There aren't enough members to pair up.");
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

      channel.send(res);
    } else {
      console.log("Error: Channel is not of type text");
    }
  };
};
