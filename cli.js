#!/usr/bin/env node
import fs from 'node:fs';
import { diffJson, summarizeChanges } from './index.js';

const [beforePath, afterPath] = process.argv.slice(2);
if (!beforePath || !afterPath) {
  console.error('Usage: json-diff <before.json> <after.json>');
  process.exit(1);
}

const before = JSON.parse(fs.readFileSync(beforePath, 'utf8'));
const after = JSON.parse(fs.readFileSync(afterPath, 'utf8'));
const changes = diffJson(before, after);
console.log(JSON.stringify({ summary: summarizeChanges(changes), changes }, null, 2));
