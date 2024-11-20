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
  
    const commandData = this.commands.map((cmd) => {
      if (cmd.data && typeof cmd.data.toJSON === 'function') {
        return cmd.data.toJSON(); 
      } else {
        Logger.error(`Comando ${cmd.name} não tem dados válidos.`);
        return null; 
      }
    }).filter(cmd => cmd !== null); 
  
    try {
      Logger.info('Registrando comandos no Discord...');
      await rest.put(
        Routes.applicationCommands(Config.clientid), 
        { body: commandData }
      );
      Logger.success('Comandos registrados com sucesso!');
    } catch (error) {
      Logger.error('Erro ao registrar os comandos:', error);
    }
  }
  
  async start() {
    try {
      Logger.info('Iniciando o bot...');
      await this.dbWrapper.connect(); 
      await loadCommands(this); 
      await loadEvents(this);
      await this.registerCommands(); 
      await this.login(this.token); 
      Logger.success('Bot online e pronto para uso!');
    } catch (error) {
      Logger.error('Erro ao iniciar o bot:', error);
      process.exit(1); 
    }
  }
}

export default Main;
