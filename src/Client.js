import { Client, GatewayIntentBits } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import { loadCommands } from '#Handlers/CommandHandler.js';
import { loadEvents } from '#Handlers/EventHandler.js';
import { DBWrapper } from '#Database/DBWrapper.js';
import { Logger } from '#Logger';
import Config from '#Config';

class Main extends Client {
  constructor(options = {}) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
      ],
    });

    this.token = options.token || process.env.TOKEN || Config.token;
    this.commands = [];
    this.dbWrapper = new DBWrapper(); 
  }

  async registerCommands() {
    const rest = new REST({ version: '10' }).setToken(this.token);

    const commandData = this.commands
      .map((cmd) => (cmd.data && typeof cmd.data.toJSON === 'function' ? cmd.data.toJSON() : null))
      .filter(cmd => cmd !== null);

    try {
      await rest.put(
        Routes.applicationCommands(Config.clientid), 
        { body: commandData }
      );
      Logger.success('Commands successfully registered.');
    } catch (error) {
      Logger.error('Failed to register commands with Discord.', error);
    }
  }

  async start() {
    try {
      // Carrega banco de dados, comandos e eventos em paralelo para rapidez
      await Promise.all([
        this.dbWrapper.connect(), 
        loadCommands(this), 
        loadEvents(this)
      ]);

      await this.registerCommands(); 
      await this.login(this.token); 
      
      Logger.custom(
        { name: "STARTUP", options: ["green", "bold"] },
        `Bot started successfully and is ready!`
      );
    } catch (error) {
      Logger.error('Failed to start the bot.', error);
      process.exit(1); 
    }
  }
}

export default Main;
