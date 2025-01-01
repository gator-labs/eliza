import { Action, IAgentRuntime, Memory } from "@elizaos/core";

export const createQuestion: Action = {
    name: "CREATE_QUESTION",
    description: "Create a new question in the Chomp game",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        // Validate input parameters
        return true;
    },
    handler: async (runtime: IAgentRuntime, message: Memory) => {
        // Implementation to create new questions
        return true;
    }
};