import { Plugin, IAgentRuntime } from "@elizaos/core";
import { createQuestion } from "./actions/createQuestion.ts";

export * as actions from "./actions";

export const chompPlugin: Plugin = {
    name: "CHOMP",
    description: "Agent bootstrap with basic actions and evaluators",
    actions: [createQuestion],
    evaluators: [],
    providers: [],
};
