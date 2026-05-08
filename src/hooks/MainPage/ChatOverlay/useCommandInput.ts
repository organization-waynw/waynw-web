import { useState } from "react";
import { Command, COMMANDS } from "../../../types/Chat/Chat";

export function useCommandInput() {
  const [input, setInput] = useState("");
  const [commandPalette, setCommandPalette] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState<Command[]>(COMMANDS);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleChange = (val: string) => {
    setInput(val);

    if (val.startsWith("/")) {
      const query = val.slice(1).toLowerCase();

      const filtered = COMMANDS.filter(
        (c) =>
          c.label.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query),
      );

      setFilteredCommands(filtered);
      setCommandPalette(true);
      setSelectedIndex(0);
    } else {
      setCommandPalette(false);
    }
  };

  const applyCommand = (cmd: Command) => {
    setInput(cmd.value + "\n");
    setCommandPalette(false);
  };

  return {
    input,
    setInput,
    commandPalette,
    filteredCommands,
    selectedIndex,
    setSelectedIndex,
    handleChange,
    applyCommand,
    setCommandPalette,
  };
}
