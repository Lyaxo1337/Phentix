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
        valueName: 'permlevel', 
        index: 2, 
        joinTogether: true
      },
      {
        valueName: "init",
        index: 3,
        joinTogether: true,
        allowFlags: true,
      },
    ],
    aliases: ["wc"],
  },
  run: async (_client: Client, commandData) => {
    const parameter = commandData.values.get("param")?.toString();
    let cmdTrigger = commandData.values.get("trigger");
    let wcPerm = commandData.values.get("permlevel")
    const commandInfo = commandData.values.get("init");
    switch (parameter) {
      case "create":
        if (!cmdTrigger) return commandData.reply("Provide a trigger for the wildcard!");
        if(!wcPerm) 
          return commandData.reply("Include a permission level! Must be 0, 1, 2, or 3!")
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
                permLevel: wcPerm
              },
            },
          }
        );
        await commandData.reply({
          embeds: [
            new MessageEmbed({color: "RED", title: "Created a new Wildcard!", description:  `Generated new WC with the trigger: \`${cmdTrigger}\` which initializes \`${commandInfo}\``})
          ]
        });
        break;
      case "delete":
        if (!cmdTrigger) return commandData.reply("Provide a trigger to search for!");
        const wc = await _client.findWildcard(
          commandData.guild.id,
          cmdTrigger!.toString()
        );
        if (!wc[0].trigger && !wc[0].content) return commandData.reply("I can't find this wildcard, are you sure it exists?");
        await Settings.updateOne(
          { _id: commandData.guild.id },
          {
            $pull: {
              wildcards: {
                trigger: wc[0].trigger,
                content: wc[0].content,
                permLevel: wc[0].permLevel
              },
            },
          }
        );
        await commandData.reply({ embeds: [new MessageEmbed({title: "Removed New Wildcard!", color: "RED", description: `Wildcard "\`${wc[0].trigger}\`" has been deleted.`})]});
        break;
      case "search":
        if (!cmdTrigger)
          return commandData.reply("Please include a trigger to search for!");
        const wildcard = await _client.findWildcard(
          commandData.guild.id,
          cmdTrigger!.toString()
        );
        if (!wildcard[0].trigger && !wildcard[0].content) return commandData.reply("I can't find this wildcard, are you sure it exists?");
        await commandData.reply({
          embeds: [
            new MessageEmbed({title: `Showing Wildcard Info for ${cmdTrigger}`, description: `Wildcard Trigger: \`${wildcard[0].trigger}\`\nInitializes Command: \`${wildcard[0].content}\`\n Wildcard Permission Level: \`${wildcard[0].permLevel}\``, color: "RED"})
          ]
      });
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
        await commandData.reply("Provide a value of `create`, `delete`, `search`, or `list`");
    }
  },
};

export default wildcard;
