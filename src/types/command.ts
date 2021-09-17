import {
  Client,
  Collection,
  Guild,
  GuildMember,
  Interaction,
  Message,
  MessagePayload,
  ReplyMessageOptions,
  TextBasedChannels,
  User,
} from "discord.js";

import { ISettings } from "./mongodb";

/**
 * CommandData is an improvised interface that unites both message and interaction
 * into one data struct
 *
 *
 * TODO:
 *  - Add possible function to resolve the value to the given type currently its weird.
 *    you need a tricky solution like this
 *    @code
 *    ```ts
 *      let message: string | number | boolean | undefined = commandData.values.filter(v => v.name == "message")[0].value;
 *      commandData.raw?.reply(message ? message.toString() : "something went wrong.");
 *    ```
 *
 * @code
 * ```ts
 * // Note: raw?.reply works in both cases because Message and Interaction both have the reply function.
 * if(raw typeof Message)
 *    data.raw?.reply("I'm a message");
 * else
 *    data.raw?.reply("I'm a interaction (slash command)");
 * ```
 *
 * (if for whatever reason raw is undefined please check the code)
 */
export interface CommandData {
  client: Client;
  name: string;
  author: User;
  member: GuildMember;
  guild: Guild;
  channel: TextBasedChannels;
  values: Collection<string, string | number | boolean | undefined>;
  raw: Message | Interaction;
  settings: ISettings;
  reply: (options: string | MessagePayload | ReplyMessageOptions) => Promise<void>;
}

export interface Command {
  config: {
    information: {
      name: string;
      description: string;
      category?: string;
      permLevel?: string;
    };
    aliases: string[];
    neededValues: {
      valueName: string;
      index: number | 0;
      joinTogether: boolean | false;
    }[];
  };
  run: (client: Client, commandData: CommandData) => Promise<any>;
  init?: (client: Client) => never;
}
