import { EmbedBuilder } from "discord.js";

export function createEmbed({ title = "", description = "", color = 0x0099ff }) {
  const embed = new EmbedBuilder()
    .setDescription(description)
    .setColor(color);            
  
  if (title) {
    embed.setTitle(title);       
  }

  return embed;
}
