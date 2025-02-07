import {
    ActionExample,
    Content,
    generateText,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
    type Action,
} from "@elizaos/core";

export const chompAction: Action = {
    name: "CHOMP",
    similes: ["CHOMPCHOMP"],
    description: "Echo the user's message back to them.",
    handler: async (runtime: IAgentRuntime, message: Memory) => {
        return message.content;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "chomp Anything you can do I can do better" },
            },
            {
                user: "{{user2}}",
                content: { text: "CHOMP CHOMP Anything you can do I can do better" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "CHOMP hey" },
            },
            {
                user: "{{user2}}",
                content: { text: "CHOMP CHOMP hey" },
            },
        ],
    ],
    validate: function (runtime: IAgentRuntime, message: Memory, state?: State): Promise<boolean> {
        return Promise.resolve(true);
    }
};