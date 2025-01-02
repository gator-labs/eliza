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

// async function postTweet(content: string): Promise<boolean> {
//     try {
//         const scraper = new Scraper();
//         const username = process.env.TWITTER_USERNAME;
//         const password = process.env.TWITTER_PASSWORD;
//         const email = process.env.TWITTER_EMAIL;
//         const twitter2faSecret = process.env.TWITTER_2FA_SECRET;

//         if (!username || !password) {
//             elizaLogger.error(
//                 "Twitter credentials not configured in environment"
//             );
//             return false;
//         }

//         // Login with credentials
//         await scraper.login(username, password, email, twitter2faSecret);
//         if (!(await scraper.isLoggedIn())) {
//             elizaLogger.error("Failed to login to Twitter");
//             return false;
//         }

//         // Send the tweet
//         elizaLogger.log("Attempting to send tweet:", content);
//         const result = await scraper.sendTweet(content);

//         const body = await result.json();
//         elizaLogger.log("Tweet response:", body);

//         // Check for Twitter API errors
//         if (body.errors) {
//             const error = body.errors[0];
//             elizaLogger.error(
//                 `Twitter API error (${error.code}): ${error.message}`
//             );
//             return false;
//         }

//         // Check for successful tweet creation
//         if (!body?.data?.create_tweet?.tweet_results?.result) {
//             elizaLogger.error(
//                 "Failed to post tweet: No tweet result in response"
//             );
//             return false;
//         }

//         return true;
//     } catch (error) {
//         // Log the full error details
//         elizaLogger.error("Error posting tweet:", {
//             message: error.message,
//             stack: error.stack,
//             name: error.name,
//             cause: error.cause,
//         });
//         return false;
//     }
// }

export const askQuestion: Action = {
    name: "ASK_QUESTION",
    similes: ["NEW_QUESTION", "CREATE_QUESTION"],
    description: "Ask a new question on the CHOMP platform",
    validate: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State
    ) => {
        const hasCredentials =
            !!process.env.CHOMP_API_URL && !!process.env.CHOMP_API_KEY;
        elizaLogger.log(`Has CHOMP credentials: ${hasCredentials}`);

        return hasCredentials;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State
    ): Promise<boolean> => {
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
                    action: "POST_TWEET",
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
