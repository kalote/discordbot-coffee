const cronFn = (channel) => {
  return () => {
    console.log("Cron executed!");
    
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
      if (index % 2 === 0) {
        if (memberArr[index+1] !== undefined) {
          pairs.push(`${member.user.username} with ${memberArr[index + 1].user.username}`);
        } else {
          pairs.push(`${member.user.username} will have a coffee with me 🤖`);
        }
      }
    });
  
    const intro = "Let's have random virtual coffee (or mate) to know each other better!\n\n\☕️ Today's pairs are:\n\n";
    const outro = "\n\nYour favorite bot 🤖"
    const res = intro + pairs.join('\n') + outro;
    
    channel.send(res);    
  }
}
module.exports = { cronFn };