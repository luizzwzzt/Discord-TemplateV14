import { EmbedBuilder } from "discord.js";

export function createEmbed({ title = "", description = "", color = 0x0099ff }) {
  const embed = new EmbedBuilder()
    .setDescription(description)
    .setColor(color);            
  
  // Se o título for fornecido, adicione-o
  if (title) {
    embed.setTitle(title);       // Se houver título, define
  }

  return embed;
}
