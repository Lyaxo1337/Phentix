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
      {
        valueName: "message",
        index: 0,
        joinTogether: true,
      },
    ],
  },
  run: async (_client: Client, commandData: CommandData) => {
    await commandData.reply(commandData.values.get("message")!.toString());
  },
};

export default echo;
