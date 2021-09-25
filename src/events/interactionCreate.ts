import {
  Client,
  Collection,
  GuildMember,
  Interaction,
  MessagePayload,
  ReplyMessageOptions,
} from "discord.js";

import { CommandData } from "../types/command";
import { ISettings } from "../types/mongodb";
import { SettingsModel } from "../../models/GuildSettings";

export default async (client: Client, interaction: Interaction): Promise<void> => {
  if (!interaction.isCommand()) return;
  if (!interaction.guild) return;

  client.settings = await SettingsModel.findOneAndUpdate(
    { _id: interaction.guild.id },
    {},
    {
      upsert: true,
      setDefaultsOnInsert: true,
      new: true,
    }
  );
  if (interaction.options.getSubcommand(false))
    console.log("command does have a subcommand");
  const command = interaction.commandName.toLowerCase();
  console.log(interaction.options.data[0].options);
  console.log(interaction.options.data.map((data) => [data.name, data.value]));
  console.log(
    interaction.options.data.map((data) => {
      if (data.type === "SUB_COMMAND") interaction.options.get(data.name);
    })
  );
  const commandData: CommandData = {
    client,
    name: command,
    author: interaction.user,
    member: <GuildMember>interaction.member,
    guild: interaction.guild,
    channel: interaction.channel!,
    values: new Collection<string, string | number | boolean | undefined>(
      interaction.options.data.map((data) => [data.name, data.value])
    ),
    raw: interaction,
    settings: <ISettings>client.settings.get(interaction.guild?.id),
    reply: async (options: string | MessagePayload | ReplyMessageOptions) => {
      await commandData.raw?.reply(options);
    },
  };

  const level = client.permLevel(commandData);

  if (level == -1) {
    return;
  }

  commandData.author.permLevel = level;
  client.emit("commandTrigger", commandData);
};
