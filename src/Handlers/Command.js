import { SlashCommandBuilder } from "discord.js";

export default class Command {
  constructor(client, options) {
    this.client = client;
    this.name = options.name.toLowerCase();  
    this.description = options.description;
    this.options = options.options;
    this.requireDatabase = options.requireDatabase || false;
    this.ownerOnly = options.ownerOnly || false;
    this.cooldown = options.cooldown || null;
    this.permissions = options.permissions || [];

    this.data = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description);
  }
}
