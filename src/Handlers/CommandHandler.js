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
          name: CommandClass.name.toLowerCase(),  
          description: CommandClass.description, 
          cooldown: CommandClass.cooldown || 5000,  
          ownerOnly: CommandClass.ownerOnly || false,  
          permissions: CommandClass.permissions || [],  
        });

        client.commands.push(commandInstance); 
      }
    }
    Logger.custom(
      { name: "COMMANDS", options: ["blue", "bold"] },
      `Commands loaded successfully`
    );
  } catch (error) {
    Logger.error("Error loading commands:", error);
  }
}
