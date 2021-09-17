const { SlashCommandBuilder } = require("@discordjs/builders");

const test = new SlashCommandBuilder().setName("test").setDescription("test command.");

export default test;
