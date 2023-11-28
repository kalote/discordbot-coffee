import { Channel, ChannelType } from "discord.js";

export default (channel: Channel): (() => void) => {
  return () => {
    console.log("Cron lunch executed!");

    if (channel.type === ChannelType.GuildText) {
      const title = "🥗  **Office Lunch Reminder!**  🍔\n\n";
      const msg =
        "@ here Please take the time now to make sure your lunch orders are in for next week!\n";
      const link =
        "Employee Lunch Tracker: <https://docs.google.com/spreadsheets/d/1RngXZnQbGkF1Sj1-JVXvAUa1qxciL0Vy0OeBrsNnAAE/edit#gid=158436719>";
      const outro = "\n\nYour favorite bot 🤖";

      const res = title + msg + link + outro;

      channel.send(res);
      return;
    } else {
      console.log("Error: Channel is not of type text");
    }
  };
};
