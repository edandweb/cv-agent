import { readFile } from "node:fs/promises";

console.log("CV Agent is running");

let jobDescription: string;
const postingPath = process.argv[2];


if(!postingPath) {
    console.error("Please provide job description path");
    process.exit(1);
}

try {
    jobDescription = await readFile(postingPath, "utf8");
    console.log(jobDescription);
} catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error(`${postingPath} - ${reason}`);
    process.exit(1);
}


    