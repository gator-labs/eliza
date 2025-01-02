import { Plugin, IAgentRuntime } from "@elizaos/core";
import { askQuestion } from "./actions/askQuestion.ts";

export * as actions from "./actions";

export const chompPlugin: Plugin = {
    name: "CHOMP",
    description: "Agent bootstrap with basic actions and evaluators",
    actions: [askQuestion],
    evaluators: [],
    providers: [],
};
