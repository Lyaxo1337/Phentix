import { Command, CommandData } from "../../types/command";

import { Client } from "discord.js";

const echo: Command = {
  config: {
    information: {
      name: "echo",
      description: "sussy",
      permLevel: "Bot Owner",
    },
    aliases: [],
    neededValues: [
      {
        valueName: "message",
        index: 0,
        joinTogether: true,
      },
    ],
  },
  run: async (_client: Client, commandData: CommandData) => {
    console.log(commandData.values);
    commandData.raw?.reply(commandData.values.get("message")!.toString());
  },
};

export default echo;
