import Main from './Client.js';
import { Logger } from '#Logger';

(async () => {
  const client = new Main();
  try {
    await client.start(); 
  } catch (error) {
    Logger.error('Erro ao inicializar o bot:', error);
    process.exit(1);
  }
})();
