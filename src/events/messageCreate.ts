import { Collection, Message, MessagePayload, ReplyMessageOptions } from "discord.js";
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
  if (!prefixRegex.test(message.content)) return;

  const match: RegExpMatchArray | null = message.content.match(prefixRegex);

  if (!match) return;

  const [, matchedPrefix] = match;

  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
  const cmd = args?.shift()?.toLowerCase();

  if (cmd?.length === 0) return;

  let command: Command | undefined;
  if (client.commands.has(<string>cmd)) command = client.commands.get(<string>cmd);
  else command = client.commands.get(<string>client.aliases.get(<string>cmd));

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
