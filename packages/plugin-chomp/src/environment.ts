import { IAgentRuntime } from "@elizaos/core";

export function validateChompConfig(runtime: IAgentRuntime): void {
    const requiredSettings = ["CHOMP_API_URL", "CHOMP_API_KEY"];

    for (const setting of requiredSettings) {
        if (!runtime.getSetting(setting)) {
            throw new Error(`Missing required setting: ${setting}`);
        }
    }
}
