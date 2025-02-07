import type { Plugin } from "@elizaos/core";
import { chompAction } from "./actions/chompAction";

// Action setup
export const chompPlugin: Plugin = {
    name: "chomp",
    description: "CHOMP Plugin for Eliza",
    actions: [chompAction],
    evaluators: [],
    providers: [],
};

export default chompPlugin;
