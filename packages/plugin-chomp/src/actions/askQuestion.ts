import {
    Action,
    IAgentRuntime,
    Memory,
    State,
    composeContext,
    elizaLogger,
    ModelClass,
    generateObject,
} from "@elizaos/core";
import { questionTemplate } from "../templates";
import { isQuestion, QuestionSchema } from "../types";

async function composeQuestion(
    runtime: IAgentRuntime,
    _message: Memory,
    state?: State
): Promise<string> {
    try {
        const context = composeContext({
            state,
            template: questionTemplate,
        });

        const questionObject = await generateObject({
            runtime,
            context,
            modelClass: ModelClass.SMALL,
            schema: QuestionSchema,
            stop: ["\n"],
        });

        if (!isQuestion(questionObject.object)) {
            elizaLogger.error(
                "Invalid question content:",
                questionObject.object
            );
            return;
        }

        const trimmedContent = questionObject.object.text.trim();

        return trimmedContent;
    } catch (error) {
        elizaLogger.error("Error composing tweet:", error);
        throw error;
    }
}

async function submitAskQuestion(content: string): Promise<boolean> {
    try {
        const apiUrl = `${process.env.CHOMP_API_URL}/api/eliza`;
        // Send the tweet
        elizaLogger.log(
            "Attempting to submit question to CHOMP:",
            content,
            apiUrl
        );
        const result = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "api-key": process.env.CHOMP_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question: content,
                correctOption: "A",
                type: "BinaryQuestion", // or "MultiChoice"
            }),
        });

        const body = await result.json();
        elizaLogger.log("Tweet response:", body);

        // Check for Twitter API errors
        if (body.errors) {
            const error = body.errors[0];
            elizaLogger.error(
                `Twitter API error (${error.code}): ${error.message}`
            );
            return false;
        }

        return true;
    } catch (error) {
        // Log the full error details
        elizaLogger.error("Error posting tweet:", {
            message: error.message,
            stack: error.stack,
            name: error.name,
            cause: error.cause,
        });
        return false;
    }
}

export const askQuestion: Action = {
    name: "ASK_QUESTION",
    similes: ["NEW_QUESTION", "CREATE_QUESTION"],
    description: "Ask a new question on the CHOMP platform",
    validate: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State
    ) => {
        const hasCredentials = !!process.env.CHOMP_API_KEY;
        elizaLogger.log(
            `Has CHOMP credentials (CHOMP_API_KEY): ${hasCredentials}`
        );

        return hasCredentials;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State
    ): Promise<boolean> => {
        elizaLogger.info("ASK_QUESTION action called");
        try {
            // Generate tweet content using context
            const questionContent = await composeQuestion(
                runtime,
                message,
                state
            );

            if (!questionContent) {
                elizaLogger.error("No content generated for question");
                return false;
            }

            elizaLogger.log(`Generated question: ${questionContent}`);

            // Check for dry run mode - explicitly check for string "true"
            if (
                process.env.CHOMP_DRY_RUN &&
                process.env.CHOMP_DRY_RUN.toLowerCase() === "true"
            ) {
                elizaLogger.info(
                    `Dry run: would have asked question: ${questionContent}`
                );
                return true;
            } else {
                await submitAskQuestion(questionContent);
            }

            return true;
            // return await postTweet(questionContent);
        } catch (error) {
            elizaLogger.error("Error in post action:", error);
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "You should ask that" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll post this question to CHOMP right away.",
                    action: "ASK_QUESTION",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Ask this question" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll post that as a question now.",
                    action: "ASK_QUESTION",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Share that on chomp" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll ask this as a question on CHOMP.",
                    action: "ASK_QUESTION",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Post that on CHOMP" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll ask this as a question on CHOMP.",
                    action: "ASK_QUESTION",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "You should put that on CHOMP dot games" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll put this message up on app.chomp.games now.",
                    action: "ASK_QUESTION",
                },
            },
        ],
    ],
};
