import { readdirSync } from "fs";
import { join } from "path";
import { pathToFileURL } from "url";
import { Logger } from "#Logger";

export const loadEvents = async (client, eventsPath = "src/Events") => {
  try {
    const categories = readdirSync(eventsPath);

    for (const category of categories) {
      const files = readdirSync(join(eventsPath, category));
      
      for (const file of files) {
        const filePath = join(process.cwd(), eventsPath, category, file);
        const EventClassModule = await import(pathToFileURL(filePath).href);
        const EventClass = EventClassModule.default;
        
        const eventInstance = new EventClass(client);
        
        if (eventInstance && typeof eventInstance.run === "function") {
          client.on(eventInstance.name, eventInstance.run);
          Logger.custom(
            { name: "EVENT", options: ["magenta", "bold"] },
            `Loading event: ${file}`
          );
        } else {
          Logger.warn(
            `Event file ${file} does not export a valid event with a 'run' method.`
          );
        }
      }
    }

    Logger.success("Events loaded successfully.");
  } catch (error) {
    Logger.error("Error loading events:", error);
  }
};
