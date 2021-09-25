import {
  Client,
  Collection,
  CommandInteractionOptionResolver,
  MessagePayload,
  ReplyMessageOptions,
} from "discord.js";
import { Command, CommandData } from "./command";

import { IConfig } from "../../config";
import { ISettings } from "./mongodb";
import { SlashCommandBuilder } from "@discordjs/builders";

interface EcoObj {
  userID: Snowflake;
  money: number;
}
declare module "discord.js" {
  export interface Client {
    /* VARIABLES */
    prefix: string;
    commands: Collection<string, Command>;
    aliases: Collection<string, string>;
    config: IConfig;
    levelCache: {
      [key: string]: number;
    };
    settings: ISettings;
    slashCommands: Collection<string, SlashCommandBuilder>;

    /* FUNCTIONS */
    log(type: string, msg: any, title?: string): void;

    permLevel(commandData: CommandData): number;

    getEcoAccount(
      guildID: string,
      userAccount: string
    ): Promise<[{ userID: string; money: number | 0 }]>;

    findWildcard(
      guildID: string,
      triggerToSearch: string
    ): Promise<[{ trigger: string; content: string }]>;

    loadCommand(
      category: string,
      commandName: string,
      dontLog: boolean
    ): { err: string; res?: undefined } | { res: boolean; err?: undefined };
  }

  export interface Base {
    client: Client;
    settings: ISettings;
  }

  export interface Interaction {
    reply: (options: string | MessagePayload | ReplyMessageOptions) => Promise<void>;
    options: CommandInteractionOptionResolver;
  }

  export interface User {
    permLevel: number;
    settings: ISettings;
  }

  export interface Message {
    args: string[];
    settings: ISettings;
  }
}
