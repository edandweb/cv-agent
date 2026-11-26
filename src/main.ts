import { readFile } from "node:fs/promises";
import { assessJobForCandidate } from "./agent.js";

let jobDescription: string;
const postingPath = process.argv[2];


if (!postingPath) {
    console.error("Please provide job description path");
    process.exit(1);
}

try {
    jobDescription = await readFile(postingPath, "utf8");
} catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error(`${postingPath} - ${reason}`);
    process.exit(1);
}

try {
    const assessment = await assessJobForCandidate(jobDescription);

    console.log(JSON.stringify(assessment, null, 2));

} catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error(reason);
    process.exit(1);
}