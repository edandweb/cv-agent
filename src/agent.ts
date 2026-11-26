import Anthropic from "@anthropic-ai/sdk";
import { profile } from "./profile.js";
import { readCv, readCVTool } from "./tool.js";
const assessmentSchema = {
    type: "object",
    properties: {
        apply: { type: "boolean", description: "Whether the candidate should apply" },
        gaps: { type: "array", items: { type: "string" }, description: "Requirements the CV does not support" },
        reason: { type: "string", description: "Why the candidate should or should not apply, in two or three sentences." },
        points_to_put_forward: { type: "array", items: { type: "string" }, description: "Experience from the CV that matches the posting's requirements, most relevant first" }
    },
    required: ["apply", "gaps", "reason", "points_to_put_forward"],
    additionalProperties: false,
} as const;
const anthropicClient = new Anthropic();

type Assessment = {
    apply: boolean;
    reason: string;
    points_to_put_forward: string[];
    gaps: string[];
};


export async function assessJobForCandidate(postingText: string): Promise<Assessment> {

    const messages: Anthropic.MessageParam[] = [
        { role: "user", content: postingText }
    ];

    for (let i = 0; i < 5; i += 1) {

        const response = await anthropicClient.messages.create({
            model: "claude-sonnet-5-5",
            max_tokens: 2048,
            system: profile,
            messages,
            tools: [readCVTool],
            output_config: { format: { type: "json_schema", schema: assessmentSchema } }
        });

        if (response.stop_reason !== "tool_use") {
            if (response.stop_reason !== "end_turn") {
                throw new Error(`Unexpected stop reason: ${response.stop_reason}`);
            }

            const textBlock = response.content.find((block) => block.type === "text");
            if (!textBlock) {
                throw new Error("No text block in the final response");
            }
            return JSON.parse(textBlock.text) as Assessment;
        }

        messages.push({ role: "assistant", content: response.content });

        const toolResults: Anthropic.ToolResultBlockParam[] = [];
        for (const block of response.content) {
            if (block.type === "tool_use") {
                if (block.name === "read_cv") {
                    const cv = await readCv();
                    toolResults.push({
                        type: "tool_result",
                        tool_use_id: block.id,
                        content: cv,
                    });
                }
            }
        }
        messages.push({ role: "user", content: toolResults });

    }



    throw new Error("No final answer after 5 turns");
}