import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ChannelType,
  ThreadChannel,
  ForumChannel,
} from "discord.js";

const allowedRoles = [
  "Team-Tech",
  "Server-Admin",
  "Community-Managers",
  "Team-UP",
  "Team-Comms",
];

export const data = new SlashCommandBuilder()
  .setName("solve")
  .setDescription("Solve a support post");

export const execute = async (interaction: ChatInputCommandInteraction) => {
  // retrieve the channel where the interaction comes from
  const chan = interaction.client.channels.cache.get(
    interaction.channelId
  ) as ThreadChannel;
  // no parent === not a Post
  if (!chan?.parentId) {
    console.log(`❌ /solve called from a wrong channel by ${interaction.user.id}`);
    return;
  }
  // retrieve the parent channel
  const parentChan = interaction.client.channels.cache.get(
    chan.parentId
  ) as ForumChannel;
  // check that the channel is a post from a forum
  if (
    chan.type === ChannelType.PublicThread &&
    parentChan?.type === ChannelType.GuildForum
  ) {
    // retrieve the initiator info
    const member = interaction.guild?.members.cache.get(interaction.user.id);
    // check if he has a special role
    const hasAllowedRole = member?.roles.cache.some((role) =>
      allowedRoles.includes(role.name)
    );
    // check if he's the OP or if he has special role
    if (interaction.user.id === chan.ownerId || hasAllowedRole) {
      console.log(`✅ /solve called by ${interaction.user.id}`);
      const availableTags = parentChan?.availableTags;
      // get the "solved" tag id
      const [solvedTag] = availableTags.filter((tag) => tag.name === "Solved");
      // apply tag
      await chan.setAppliedTags([solvedTag.id]);
      // lock thread
      await chan.setLocked(true);
      // last message
      await interaction.reply(
        "This post is now locked and marked as resolved. Thank you for your contributions!"
      );
    } else {
      console.log(`❌ /solve called from user without perm`);
      // PERMISSION ERROR
      await interaction.reply({
        content:
          "Permission denied: You're not authorized to manage this post.",
        ephemeral: true,
      });
    }
  } else {
    console.log(`❌ /solve called from a wrong channel by ${interaction.user.id}`);
    // CHANNEL ERROR
    await interaction.reply({
      content:
        "This command cannot be used in this channel. `/solved` can only be used in Forum posts.",
      ephemeral: true,
    });
  }
};
