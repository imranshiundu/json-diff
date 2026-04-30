# json-diff

**json-diff** is a zero-dependency CLI and library for comparing two JSON files.

## Features

- Recursive object diffs
- Array comparison support
- JSON Pointer-style paths
- Added, removed, changed, and array-length changes
- Markdown report output
- Compact JSON output for automation
- Safe non-zero exit code when differences are found

## Usage

```bash
node cli.js before.json after.json
```

Markdown report:

```bash
node cli.js before.json after.json --markdown
```

Ignore array order for primitive arrays:

```bash
node cli.js before.json after.json --ignore-array-order
```

## Library

```js
import { diffJson } from './index.js';

const changes = diffJson({ a: 1 }, { a: 2 });
```

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | No changes |
| `1` | Input or runtime error |
| `2` | Differences found |
