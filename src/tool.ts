import { Anthropic } from "@anthropic-ai/sdk";

import { readFile } from "node:fs/promises";
const CV_PATH = 'data/cv.md';

export const readCVTool: Anthropic.Tool = {
    name: "read_cv",
    description: "Returns the full text of the candidate's CV. Call it before assessing a posting, to check experience, skills and dates.",
    input_schema: {
        type: "object",
        properties: {}
    }
};

export async function readCv(): Promise<string> {

    const cv = await readFile(CV_PATH, 'utf-8');
    return cv;
} 