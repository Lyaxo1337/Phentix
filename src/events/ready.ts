import { Client } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import mongoose from "mongoose";
import { table } from "table";

export default async (client: Client): Promise<void> => {
  if (!process.env.mongo_url)
    client.log(
      `READY`,
      `\n${table([
        [
          `${client.user?.username}#${
            client.user?.discriminator
          } is ready and the database is ${
            "not connected".bgRed.black
          } due to mongo_url not being provided within .env`,
        ],
      ])}`
    );
  else
    mongoose.connect(
      process.env.mongo_url,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      },
      (err) => {
        if (err) console.error(err);

        client.log(
          `READY`,
          `\n${table([
            [
              `${client.user?.username}#${
                client.user?.discriminator
              } is ready and the database is ${"connected.".bgGreen.black}`,
            ],
          ])}`
        );
      }
    );

  const rest = new REST({ version: "9" }).setToken(process.env.token || "");

  try {
    client.log("SLASH", "Started refreshing application (/) commands.");

    console.log(
      table(
        [
          client.slashCommands.map(
            (value) =>
              `${"[".grey} ${value.name.green} - ${value.description.white} ${"]".grey}`
          ),
        ],
        {
          header: { content: "Current Slash Command's", wrapWord: true },
        }
      )
    );

    await rest.put(Routes.applicationCommands(client.user?.id || "0"), {
      body: client.slashCommands.map((value) => value.toJSON()),
    });
    client.log("SLASH", "Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};
