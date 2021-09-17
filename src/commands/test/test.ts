import { Command, CommandData } from "../../types/command";

import { Client } from "discord.js";

const test: Command = {
  config: {
    information: {
      name: "test",
      description: "sussy",
      permLevel: "user",
    },
    aliases: [],
    neededValues: [
      {
        valueName: "test",
        index: 0,
        joinTogether: false,
      },
      {
        valueName: "test2",
        index: 1,
        joinTogether: true,
      },
    ],
  },
  run: async (_client: Client, commandData: CommandData) => {
    console.log(commandData);
    commandData.values.forEach((v, k) => {
      commandData.reply(`${v} - ${k}`);
    });
  },
};

export default test;
