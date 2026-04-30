#!/usr/bin/env node
import fs from 'node:fs/promises';
import { diffJson, formatMarkdown, summarizeChanges } from './index.js';

function parseArgs(argv) {
  const args = {};
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--markdown') args.markdown = true;
    else if (arg === '--ignore-array-order') args.ignoreArrayOrder = true;
    else if (arg === '--help' || arg === '-h') args.help = true;
    else positional.push(arg);
  }
  args.beforePath = positional[0];
  args.afterPath = positional[1];
  return args;
}

function help() {
  console.log(`json-diff

Usage:
  node cli.js before.json after.json [--markdown] [--ignore-array-order]
`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.beforePath || !args.afterPath) return help();
  const before = JSON.parse(await fs.readFile(args.beforePath, 'utf8'));
  const after = JSON.parse(await fs.readFile(args.afterPath, 'utf8'));
  const changes = diffJson(before, after, '', args);

  if (args.markdown) console.log(formatMarkdown(changes));
  else console.log(JSON.stringify({ summary: summarizeChanges(changes), changes }, null, 2));

  process.exit(changes.length ? 2 : 0);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
