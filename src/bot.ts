import loader from "./lib/models/loader";
import crafting from "./lib/modules/crafting";

loader.cwd(process.cwd());
new crafting(loader.commands, {
  prefix: "?",
  token: "OTMzNzU5MzE5MTE4MzE5NjY3.YemNIg.8nkKtopzkGk5lLjSP9V5PruUAd8",
});
