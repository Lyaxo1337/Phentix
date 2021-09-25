import { Client, ClientOptions, GuildMember } from "discord.js";
import { Command, CommandData } from "../types/command";

import { SettingsModel } from "../../models/GuildSettings";
/* eslint-disable @typescript-eslint/no-var-requires */
import colors from "colors";
import { join } from "path";
import moment from "moment";
import { promisify } from "util";
import { table } from "table";

export class CustomClient extends Client {
  wait = promisify(setTimeout);

  constructor(options: ClientOptions) {
    super(options);

    // `await client.wait(1000);` to "pause" for 1 second.

    // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
    process.on("uncaughtException", (err) => {
      if (err.stack) {
        const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
        console.error("Uncaught Exception: ", errorMsg);
      }

      // Always best practice to let the code crash on uncaught exceptions.
      // Because you should be catching them anyway.
      process.exit(1);
    });

    process.on("unhandledRejection", (err) => {
      console.error("Uncaught Promise Error: ", err);
    });
  }

  /*
      Logs to console
  */
  log(type: string, msg: string | null, title?: string): void {
    if (!title) {
      title = "Log";
    } else {
      title = colors.magenta.bold(title);
    }

    if (!type) {
      type = "Null";
    }

    if (["err", "error"].includes(type.toLowerCase())) {
      type = colors.bgRed.white.bold(type);
    }

    console.log(
      `[${colors.blue.bold(moment().format("D/M/Y HH:mm:ss.SSS"))}] [${type.green}] [${
        title.yellow
      }] ${msg}`
    );
  }

  getEcoAccount = async (
    guildID: string,
    userAccount: string
  ): Promise<[{ userID: string; money: number | 0 }]> => {
    await SettingsModel.updateOne(
      { _id: guildID, "eco.userID": { $ne: userAccount } },
      {
        $push: {
          eco: {
            userID: userAccount,
            money: 0,
          },
        },
      }
    );
    const res = await SettingsModel.findOne(
      { _id: guildID },
      {
        eco: {
          $elemMatch: {
            userID: userAccount,
          },
        },
      }
    );
    return res!.eco;
  };

  findWildcard = async (
    guildID: string,
    triggerToSearch: string
  ): Promise<[{ trigger: string; content: string }]> => {
    const returnedWildcard = await SettingsModel.findOne(
      { _id: guildID },
      {
        wildcards: {
          $elemMatch: {
            trigger: triggerToSearch,
          },
        },
      }
    );
    if (!returnedWildcard?.wildcards[0]) return [{ trigger: "", content: "" }];
    return returnedWildcard!.wildcards!;
  };
  /*
    COMMAND LOAD AND UNLOAD
  */
  loadCommand(
    category: string,
    commandName: string,
    dontLog: boolean
  ): { err: string; res?: undefined } | { res: boolean; err?: undefined } {
    try {
      const req = require(join(__dirname, "..", "commands", category, commandName));
      const props: Command = req.default;

      const m_NeededValues = props.config.neededValues.sort((a, b) => a.index - b.index);

      if (new Set(m_NeededValues.map((v) => v.index)).size < m_NeededValues.length) {
        this.log(
          "WARN",
          `\n${table([
            [
              `WARNING`.bgYellow.black,
              `${commandName.white} neededValues contains duplicates.`,
            ],
          ])}`
        );
        this.log(
          "WARN",
          `\n${table(
            [
              m_NeededValues.map(
                (value) =>
                  `Value "${value.valueName.green}" is located at index ${
                    value.index.toString().red
                  }`
              ),
            ],
            {
              header: { content: "CURRENT NEEDED VALUES" },
            }
          )}`
        );
      }

      if (!dontLog) {
        console.log(
          table([
            [
              `${category.white} ${"/".grey} ${commandName.white}`,
              `${"Loaded.".bgGreen.black}`,
            ],
          ])
        );
      }

      if (props.init) {
        props.init(this);
      }

      if (category) {
        props.config.information.category = category;
      }

      this.commands.set(props.config.information.name, props);

      props.config.aliases.forEach((alias) => {
        this.aliases.set(alias, props.config.information.name);
      });

      return {
        res: true,
      };
    } catch (e) {
      console.log(e);

      return {
        err: `Unable to load command ${commandName} in ${category}: ${e}`,
      };
    }
  }

  permLevel(commandData: CommandData): number {
    let permlvl = 0;

    if (!commandData.member && !commandData.raw) return 0;

    // let log = message.author.id == '405109496143282187'
    if (commandData.member) {
      const settings = this.settings.get((commandData.member as GuildMember).guild.id);
      if (settings) (commandData.member as GuildMember).settings = settings;
    }

    const permOrder = this.config.permLevels
      .slice(0)
      .sort((p, c) => (p.level < c.level ? 1 : -1));

    while (permOrder.length > 0) {
      const currentLevel = permOrder.shift();

      if (currentLevel === undefined) break;

      if ((commandData?.guild || commandData?.guild) && currentLevel.guildOnly) {
        continue;
      }

      if (currentLevel.check(commandData)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  }
}
