import { z } from "zod";

export interface Question {
    text: string;
}

export const QuestionSchema = z.object({
    text: z.string().describe("The text of the question"),
});

export const isQuestion = (obj: any): obj is Question => {
    return QuestionSchema.safeParse(obj).success;
};
