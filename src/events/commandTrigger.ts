import { Command, CommandData } from "../types/command";

import { Client } from "discord.js";

const TriggerCommand = (client: Client, dataObj: CommandData) => {
  console.log(dataObj.flags);
  let command: Command | undefined;
  if (client.commands.has(dataObj.name)) command = client.commands.get(dataObj.name);
  else command = client.commands.get(<string>client.aliases.get(dataObj.name));

  const level = client.permLevel(dataObj);

  if (!command || level == -1) {
    return;
  }

  dataObj.author.permLevel = level;

  if (level < client.levelCache[command!.config!.information!.permLevel!]) return;
  
  command?.run(client, dataObj);
};

export default TriggerCommand;
