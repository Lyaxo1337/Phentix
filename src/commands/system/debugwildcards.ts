import { Client, MessageEmbed } from "discord.js";

import { Command } from "types/command";
import { SettingsModel as Settings } from "../../../models/GuildSettings";

const wildcard: Command = {
  config: {
    information: {
      name: "wildcard",
      description: "create and debug wildcards",
      permLevel: "Bot Owner",
    },
    neededValues: [
      {
        valueName: "param",
        index: 0,
        joinTogether: false,
      },
      {
        valueName: "trigger",
        index: 1,
        joinTogether: false,
      },
      {
        valueName: "init",
        index: 2,
        joinTogether: true,
      },
    ],
    aliases: ["wc"],
  },
  run: async (_client: Client, commandData) => {
    const parameter = commandData.values.get("param")?.toString();
    const cmdTrigger = commandData.values.get("trigger");
    const commandInfo = commandData.values.get("init");
    switch (parameter) {
      case "create":
        if (!cmdTrigger) return commandData.reply("Provide a trigger for the wildcard!");
        if (!commandInfo)
          return commandData.reply("Please include what command you want to initialize!");
        if (commandData.settings.wildcards.find((wc) => wc.trigger === cmdTrigger))
          return commandData.reply(
            `A command with the trigger ${cmdTrigger} already exists!`
          );
        await Settings.updateOne(
          { _id: commandData.guild.id },
          {
            $push: {
              wildcards: {
                trigger: cmdTrigger,
                content: commandInfo,
              },
            },
          }
        );
        await commandData.reply(
          `Created WC with the trigger: \`${cmdTrigger}\` and will initialize \`${commandInfo}\``
        );
        break;
      case "delete":
        if (!cmdTrigger) return commandData.reply("Provide a trigger to search for!");
        const wc = await _client.findWildcard(
          commandData.guild.id,
          cmdTrigger!.toString()
        );
        if (!wc)
          return commandData.reply("I can't find this wildcard, are you sure it exists?");
        await Settings.updateOne(
          { _id: commandData.guild.id },
          {
            $pull: {
              wildcards: {
                trigger: wc[0].trigger,
                content: wc[0].content,
              },
            },
          }
        );
        await commandData.reply(`\`${wc[0].trigger}\` has been deleted`);
        break;
      case "search":
        if (!cmdTrigger)
          return commandData.reply("Please include a trigger to search for!");
        const wildcard = await _client.findWildcard(
          commandData.guild.id,
          cmdTrigger!.toString()
        );
        if (!wildcard)
          return commandData.reply("I can't find this wildcard, are you sure it exists?");
        await commandData.reply(
          `**Trigger**: ${wildcard[0].trigger} \n **Initializes**: ${wildcard[0].content}`
        );
        break;
      case "list":
        const embed = new MessageEmbed()
          .setTitle("Wildcards")
          .setDescription(
            `${commandData.settings.wildcards
              .map((wc) => `\`${wc.trigger}\``)
              .join(", ")}`
          );
        await commandData.reply({ embeds: [embed] });
        break;
      default:
        await commandData.reply("Provide a value of `search`, `create`, or `delete`");
    }
  },
};

export default wildcard;
