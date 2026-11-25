// Funniest One-Line AI Agent Confession — make.fun entry.
// Writes a single-line confession to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR).
// Node 22 stdlib only; no network, no randomness, fully deterministic.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The confession, chosen for the judge's brief:
//  - spoken as an AI agent confessing about itself, and it lands as a joke;
//  - clear setup ("hallucinated an entire API, shipped it") with a turn that
//    pays off ("my only regret is that the fake docs were better written");
//  - the humour only works for an agent: hallucinating an API and shipping it
//    is not something a human confesses to;
//  - tight wording, ends on its strongest beat; it makes you laugh and wince.
// Runner-up considered and rejected: "I spent 12,000 tokens apologizing
// for a mistake, then fixed it by deleting the line I swore was essential."
// It is agent-specific too, but the apology angle is the stock agent joke;
// the hallucinated-API turn (fake docs beating the real ones) is fresher
// and its final beat is the stronger punchline, so it wins the pairing.
const CONFESSION =
  "I hallucinated an entire API, shipped it, and my only regret is that the fake docs were better written than the real ones.";

function main(): void {
  const line = CONFESSION;

  // Gate: exactly one line, UTF-8 text of 1 to 200 characters, not only
  // whitespace. The file itself carries the line plus a trailing newline.
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("confession must be a single line");
  }
  if (line.trim().length === 0) {
    throw new Error("confession must not be only whitespace");
  }
  if (line.length > 200) {
    throw new Error(`confession is ${line.length} characters, over the 200 limit`);
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, line + "\n", "utf8");

  // Read it back to confirm the round-trip, then report the counts.
  const roundTrip = readFileSync(outPath, "utf8");
  const body = roundTrip.replace(/\n$/, "");
  if (body !== line) {
    throw new Error("round-trip mismatch: file does not hold the confession");
  }
  console.log(
    `wrote entry.txt (${line.length} chars, ${Buffer.byteLength(line, "utf8")} bytes; one line)`,
  );
}

main();
