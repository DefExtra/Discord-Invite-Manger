import * as fs from "fs";

const mapOFcommands: Map<string, any> = new Map();

export default {
  cwd: (dirname: string) =>
    fs
      .readdirSync(dirname + "/src/commands/")
      .filter((file) => file.endsWith(".ts"))
      .map((value) => {
        let command = require(dirname + "/src/commands/" + value)?.default;
        mapOFcommands.set(command?.name, command);
      }),
  commands: mapOFcommands,
};
