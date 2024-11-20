import Main from './Client.js';
import { Logger } from '#Logger';

(async () => {
  const client = new Main();
  
  // Captura interrupções para encerramento seguro
  process.on('SIGINT', async () => {
    Logger.custom({ name: "SHUTDOWN", options: ["yellow", "bold"] }, "Bot shutting down...");
    process.exit(0);
  });

  try {
    await client.start(); 
  } catch (error) {
    Logger.error('An error occurred while initializing the bot.', error);
    process.exit(1); 
  }
})();
