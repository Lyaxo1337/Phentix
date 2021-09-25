import { SlashCommandBuilder } from "@discordjs/builders";

const vme = new SlashCommandBuilder()
  .setName("seval")
  .setDescription("Exec commands on the current host machine.")
  .addStringOption((option) =>
    option.setName("command").setDescription("the command.").setRequired(true)
  );
export default vme;
