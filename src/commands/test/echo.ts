import { Client, MessageEmbed } from "discord.js";
import { Command, CommandData } from "../../types/command";

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
    if (commandData?.flags?.has("embed")){
    if(commandData?.flags?.has("del")){
      commandData.channel.bulkDelete(1)

      return await commandData.channel.send({
        embeds: [
          new MessageEmbed().setTitle(commandData?.flags?.get("title") ? commandData?.flags?.get("title").toString() : "").setDescription(
            commandData.values.get("message")!.toString()
          ),
        ],
      })
    }
    return await commandData.channel.send({
      embeds: [
        new MessageEmbed().setTitle(commandData?.flags?.get("title") ? commandData?.flags?.get("title").toString() : "").setDescription(
          commandData.values.get("message")!.toString()
        ),
      ],
    })
  }
    return await commandData.reply(commandData.values.get("message")!.toString());
  },
};

export default echo;
