import { Client } from "discord.js";
import { Command } from "types/command";

const bal: Command = {
  config: {
    information: {
      name: "balance",
      description: "check your balance or the balance of another user",
      permLevel: "User",
      category: "test",
    },
    aliases: ["bal"],
    neededValues: [
      {
        valueName: "user",
        joinTogether: false,
        index: 0,
      },
    ],
  },

  run: async (_client: Client, commandData) => {
    let user;
    if (commandData.values.has("user")) {
      user = commandData.guild.members.cache.get(
        <string>commandData?.values?.get("user")?.toString()
      )?.id;
    } else {
      user = commandData.author.id;
    }
    if (!user) return commandData.reply("user not found");
    const bal = await _client.getEcoAccount(commandData.guild.id, user);

    await commandData.reply(`Your balance is ${bal[0].money}.`);
  },
};

export default bal;
