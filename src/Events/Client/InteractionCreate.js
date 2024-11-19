import Event from "../../Handlers/Event.js";
import { Collection, InteractionType } from "discord.js";
import config from "../../Config/Config.js";
import { Server } from "../../Database/Schemas/GuildSchema.js";
import i18next from "../../Services/i18next.js";

const cooldowns = new Collection();

export default class extends Event {
  constructor(client) {
    super(client, {
      name: "interactionCreate",
    });
  }

  run = async (interaction) => {
    try {
      const { client } = interaction;

      if (
        interaction.type !== InteractionType.ApplicationCommand ||
        interaction.user.bot
      )
        return;

      const cmd = client.commands.find((c) => c.name === interaction.commandName);
      if (!cmd) return;

      const language = await this.getServerLanguage(interaction.guild?.id);
      const tCmd = this.getTranslator(language, "commands");
      const tErrors = this.getTranslator(language, "errors");

      if (cmd.ownerOnly && !config.owners.includes(interaction.user.id)) {
        return interaction.reply({
          content: tErrors("ownerOnly"),
          ephemeral: true,
        });
      }

      if (await this.handleCooldown(interaction, cmd, tErrors)) return;

      if (await this.checkPermissions(interaction, cmd, tErrors)) return;

      await this.executeCommand(cmd, interaction, tCmd);

      this.setCooldown(interaction, cmd);
    } catch (error) {
      console.error("Erro durante a execução do evento interactionCreate:", error);
      await interaction.reply({
        content: "Ocorreu um erro ao executar este comando.",
        ephemeral: true,
      });
    }
  };


  getServerLanguage = async (serverId) => {
    try {
      const server = await Server.findOne({ serverId });
      return server?.language || "pt-BR";
    } catch (error) {
      console.error("Erro ao buscar idioma do servidor:", error);
      return "pt-BR"; // Idioma padrão
    }
  };


  getTranslator = (language, namespace) => {
    return (key, options = {}) => i18next.t(`${namespace}:${key}`, { lng: language, ...options });
  };

  // Gerenciar cooldowns
  handleCooldown = async (interaction, cmd, t) => {
    if (!cmd.cooldown) return false;

    const cooldownKey = `${cmd.name}-${interaction.user.id}`;
    const now = Date.now();
    const expirationTime = cooldowns.get(cooldownKey);

    if (expirationTime && now < expirationTime) {
      const remainingTime = Math.floor((expirationTime - now) / 1000);

      await interaction.reply({
        content: t("cooldowns", { time: `<t:${Math.floor(expirationTime / 1000)}:R>` }),
        ephemeral: true,
      });

      return true;
    }

    return false;
  };


  checkPermissions = async (interaction, cmd, t) => {
    if (!cmd.permissions || cmd.permissions.length === 0) return false;

    const missingPermissions = cmd.permissions.filter(
      (perm) => !interaction.member.permissions.has(perm)
    );

    if (missingPermissions.length > 0) {
      await interaction.reply({
        content: t("permissions.missing", {
          permissions: missingPermissions.join(", "),
        }),
        ephemeral: true,
      });

      return true;
    }

    return false;
  };

  executeCommand = async (cmd, interaction, t) => {
    try {
      await cmd.run(interaction, t);
    } catch (error) {
      console.error("Erro ao executar o comando:", error);
      await interaction.reply({
        content: "Ocorreu um erro ao executar este comando.",
        ephemeral: true,
      });
    }
  };

  setCooldown = (interaction, cmd) => {
    if (!cmd.cooldown) return;

    const cooldownKey = `${cmd.name}-${interaction.user.id}`;
    const now = Date.now();
    const expirationTime = now + cmd.cooldown;

    cooldowns.set(cooldownKey, expirationTime);

    setTimeout(() => cooldowns.delete(cooldownKey), cmd.cooldown);
  };
}
