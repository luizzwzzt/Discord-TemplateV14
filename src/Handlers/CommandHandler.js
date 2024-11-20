import { readdirSync } from "fs";
import { join } from "path";
import { pathToFileURL } from "url";
import { Logger } from "#Logger";

export async function loadCommands(client, path = "src/Commands") {
  try {
    const categories = readdirSync(path);
    for (const category of categories) {
      const files = readdirSync(join(path, category));
      for (const file of files) {
        const filePath = join(process.cwd(), path, category, file);
        const { default: CommandClass } = await import(pathToFileURL(filePath).href);

        const commandInstance = new CommandClass(client, {
          name: CommandClass.name.toLowerCase(),  // Defina o nome do comando
          description: CommandClass.description,  // Certifique-se de passar a descrição como uma string
          cooldown: CommandClass.cooldown || 5000,  // Caso o cooldown não tenha sido definido, define o valor padrão
          ownerOnly: CommandClass.ownerOnly || false,  // Propriedade ownerOnly
          permissions: CommandClass.permissions || [],  // Permissões do comando
        });

        client.commands.push(commandInstance);  // Adiciona o comando à lista de comandos
      }
    }
    Logger.success("Commands loaded successfully.");
  } catch (error) {
    Logger.error("Error loading commands:", error);
  }
}
