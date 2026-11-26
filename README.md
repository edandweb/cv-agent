# cv-agent

A minimal LLM agent, written from scratch in Node.js and TypeScript.
It reads a job posting, checks it against a CV, and returns a structured
assessment: apply or not, the reason, the CV points to put forward, the gaps.

No agent framework: the tool loop is hand-written on top of the Anthropic SDK.

## How it works

1. `main.ts` reads the job posting from the path given on the command line.
2. The posting is sent to the model with a system prompt describing the candidate.
3. The model either answers or asks to call the `read_cv` tool.
4. If it asks, the code runs the tool and sends the CV text back.
5. Steps 3 and 4 repeat (capped at 5 turns) until the model gives its final answer.
6. The final answer is JSON in a fixed shape.

The model decides the next action; the code executes it.

## Setup

Requires Node.js 20.6 or later.

    npm install

Create a `.env` file at the project root:

    ANTHROPIC_API_KEY=your-key

## Usage

1. Paste your CV as Markdown into `data/cv.md`.
2. Save a job posting as a text file in `data/postings/`,
   for example `data/postings/acme.txt`.
3. Edit the candidate profile in the system prompt, in `src/agent.ts`.
4. Run the agent on that posting:

       npm run start -- data/postings/acme.txt

The `data/` folder is git-ignored, so your CV and postings stay local.

## Roadmap

- WhatsApp integration: receive job ads from groups
- Deployment on Kubernetes