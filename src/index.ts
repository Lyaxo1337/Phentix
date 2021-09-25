import { Collection, Intents } from "discord.js";
import path, { join } from "path";

import { CustomClient } from "./lib/client";
import { SlashCommandBuilder } from "@discordjs/builders";
import { config } from "../config";
import dotenv from "dotenv";
import klaw from "klaw";
import { table } from "table";

dotenv.config();

// if (process.env.mongodb_connection_url) {
//     mongoose.connect(process.env.mongodb_connection_url, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useFindAndModify: false,
//         useCreateIndex: true,
//     });
// }

const client = new CustomClient({
  partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"],
  intents: [
    Intents.FLAGS.GUILDS |
      Intents.FLAGS.GUILD_MESSAGES |
      Intents.FLAGS.GUILD_INTEGRATIONS |
      Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
  ],
  allowedMentions: {
    repliedUser: false,
  },
});

client.prefix = "!";
client.commands = new Collection();
// client.settings = new Collection();
client.aliases = new Collection();
client.config = config;
client.slashCommands = new Collection<string, SlashCommandBuilder>();
const run = async () => {
  // client.settings.set(
  //   "default",
  //   await SettingsModel.findOneAndUpdate(
  //     { _id: "default" },
  //     {},
  //     { upsert: true, setDefaultsOnInsert: true, new: true }
  //   )
  // );

  klaw(join(__dirname, "commands")).on("data", (item) => {
    const category = item.path.match(/\w+(?=[\\/][\w\-\.]+$)/)![0];
    const cmdFile = path.parse(item.path);

    if (!cmdFile.ext || (cmdFile.ext !== ".ts" && cmdFile.ext !== ".js")) {
      return;
    }

    if (category === "commands") {
      client.log(
        "Load",
        `Did not load command ${cmdFile.name.red} because it has no category`
      );
    } else {
      const { err } = client.loadCommand(
        category,
        `${cmdFile.name}${cmdFile.ext}`,
        false
      );

      if (err) {
        console.log(err);
      }
    }
  });

  klaw(join(__dirname, "events")).on("data", (item) => {
    const evtFile = path.parse(item.path);

    if (!evtFile.ext || (evtFile.ext !== ".ts" && evtFile.ext !== ".js")) return;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { default: event } = require(join(
      __dirname,
      "events",
      `${evtFile.name}${evtFile.ext}`
    ));
    client.on(evtFile.name, event.bind(null, client));
    client.log("EVENT LOAD", `Binding ${evtFile.name}...`);
  });

  klaw(join(__dirname, "slash-commands")).on("data", (item) => {
    const slshFile = path.parse(item.path);

    if (!slshFile.ext || (slshFile.ext !== ".ts" && slshFile.ext !== ".js")) return;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { default: cmd } = require(join(
      __dirname,
      "slash-commands",
      `${slshFile.name}${slshFile.ext}`
    ));

    console.log(
      table([
        [
          `${"slash-commands".white} ${"/".grey} ${slshFile.name.white}${
            slshFile.ext.white
          }`,
          `${"Done.".bgGreen.black}`,
        ],
      ])
    );
    client.slashCommands.set(slshFile.name, cmd);
  });

  client.levelCache = {};

  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  await client.login(process.env.token);
};

export default run();
