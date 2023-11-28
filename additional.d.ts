import type { Client } from "discord.js";
declare module "*.json" {
  const value: any;
  export default value;
}

interface ClientWithCommands extends Client {
  commands: Collection<string, any>;
}
