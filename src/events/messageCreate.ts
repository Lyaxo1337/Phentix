import {
  Collection,
  Message,
  MessageEmbed,
  MessagePayload,
  ReplyMessageOptions,
} from "discord.js";
import { Command, CommandData } from "../types/command";

import { CustomClient } from "../lib/client";
import { SettingsModel } from "../../models/GuildSettings";

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export default async (client: CustomClient, message: Message): Promise<void> => {
  if (message.author.bot || !message.guild) return;
  client.settings = await SettingsModel.findOneAndUpdate(
    { _id: message.guild.id },
    {},
    {
      upsert: true,
      setDefaultsOnInsert: true,
      new: true,
    }
  );
  message.settings = client.settings;

  const prefixRegex = new RegExp(
    `^(<@!?${client.user?.id}>|${escapeRegex(client.settings.prefix)})\\s*`
  ); // from rom, Allowing either an mention or the prefix to respond to.
  if (!prefixRegex.test(message.content)) return await notCommand(message);

  const match: RegExpMatchArray | null = message.content.match(prefixRegex);

  if (!match) return;

  const [, matchedPrefix] = match;

  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
  const cmd = args?.shift()?.toLowerCase();

  let command: Command | undefined;
  if (client.commands.has(<string>cmd)) command = client.commands.get(<string>cmd);
  else command = client.commands.get(<string>client.aliases.get(<string>cmd));

  if (!command) return;
  const commandData: CommandData = {
    client,
    name: command?.config.information.name || "fuck",
    author: message.author,
    member: message!.member!,
    guild: message.guild,
    channel: message.channel,
    values: new Collection<string, string | number | boolean | undefined>(
      command!.config.neededValues.map((_v, i) => [
        _v.valueName,
        _v.joinTogether
          ? _v.index > 0
            ? args.splice(_v.index, args.length).join(" ")
            : args.join(" ")
          : args[i],
      ])
    ),
    raw: message,
    settings: client.settings,
    reply: async (options: string | MessagePayload | ReplyMessageOptions) => {
      await commandData.raw?.reply(options);
    },
  };

  client.emit("commandTrigger", commandData);
};

const notCommand = async (message: Message) => {
  if (message.content.toLowerCase().startsWith("?")) {
    const commandName = message.content.slice("?".length).trim().split(/ +/g)[0];
    if (!commandName) return;
    const wildcard = await message.client.findWildcard(message.guild!.id!, commandName);
    if (!wildcard[0] || !wildcard[0].content) {
      await message.reply("I can't find this wildcard, are you sure it exists?");
      return;
    }
    if (wildcard[0].content.startsWith("-")) {
      const wildcardCommand = wildcard[0].content.slice(`-`.length).trim().split(/ +/g);
      const cmd = wildcardCommand?.shift()?.toLowerCase();

      let command: Command | undefined;
      if (message.client.commands.has(<string>cmd))
        command = message.client.commands.get(<string>cmd);
      else
        command = message.client.commands.get(
          <string>message.client.aliases.get(<string>cmd)
        );

      if (!command) {
        await message.reply({
          embeds: [
            new MessageEmbed().setDescription(
              `Wildcard with the name ${wildcard[0].trigger} and the content ${wildcard[0].content} has a invalid command.`
            ),
          ],
        });
        return;
      }
      const commandData: CommandData = {
        client: message.client,
        name: command?.config.information.name || "fuck",
        author: message.author,
        member: message!.member!,
        guild: message.guild!,
        channel: message.channel,
        values: new Collection<string, string | number | boolean | undefined>(
          command!.config.neededValues.map((_v, i) => [
            _v.valueName,
            _v.joinTogether
              ? _v.index > 0
                ? wildcardCommand.splice(_v.index, wildcardCommand.length).join(" ")
                : wildcardCommand.join(" ")
              : wildcardCommand[i],
          ])
        ),
        raw: message,
        settings: message.client.settings,
        reply: async (options: string | MessagePayload | ReplyMessageOptions) => {
          await commandData.raw?.reply(options);
        },
      };

      message.client.emit("commandTrigger", commandData);
    }
    await message.reply({
      embeds: [new MessageEmbed().setDescription(wildcard[0].content)],
    });
  }
};
