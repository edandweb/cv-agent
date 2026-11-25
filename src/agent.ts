import Anthropic from "@anthropic-ai/sdk";
import { profile } from "./profile.js";
const anthropicClient = new Anthropic();


export async function assessJobForCandidate(postingText: string) {


    const message = await anthropicClient.messages.create({
        model: "claude-sonnet-5-5",
        max_tokens: 2048,
        system: profile,
        messages: [{
            role: "user",
            content: postingText
        }]
    });

    return message;
}