import { ButtonBuilder, ButtonStyle } from "discord.js";

export function createButton({ label = "Button", customId = "default", style = ButtonStyle.Primary }) {
  return new ButtonBuilder()
    .setLabel(label)
    .setCustomId(customId)
    .setStyle(style);
}
