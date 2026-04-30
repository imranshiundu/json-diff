const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isPrimitiveArray = (value) => Array.isArray(value) && value.every((item) => item === null || typeof item !== 'object');

function pointer(parent, key) {
  const safe = String(key).replace(/~/g, '~0').replace(/\//g, '~1');
  return parent ? `${parent}/${safe}` : `/${safe}`;
}

function sameValue(left, right, options = {}) {
  if (options.ignoreArrayOrder && isPrimitiveArray(left) && isPrimitiveArray(right)) {
    return JSON.stringify([...left].sort()) === JSON.stringify([...right].sort());
  }
  return JSON.stringify(left) === JSON.stringify(right);
}

export function diffJson(before = {}, after = {}, path = '', options = {}) {
  const changes = [];

  if (Array.isArray(before) && Array.isArray(after)) {
    if (sameValue(before, after, options)) return changes;
    if (before.length !== after.length) {
      changes.push({ type: 'array-length', path: path || '/', before: before.length, after: after.length });
    }
    const max = Math.max(before.length, after.length);
    for (let index = 0; index < max; index += 1) {
      changes.push(...diffJson(before[index], after[index], pointer(path, index), options));
    }
    return changes;
  }

  if (!isObject(before) || !isObject(after)) {
    if (!sameValue(before, after, options)) changes.push({ type: 'changed', path: path || '/', before, after });
    return changes;
  }

  const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
  for (const key of keys) {
    const nextPath = pointer(path, key);
    if (!(key in (before || {}))) {
      changes.push({ type: 'added', path: nextPath, before: undefined, after: after[key] });
      continue;
    }
    if (!(key in (after || {}))) {
      changes.push({ type: 'removed', path: nextPath, before: before[key], after: undefined });
      continue;
    }
    changes.push(...diffJson(before[key], after[key], nextPath, options));
  }
  return changes;
}

export function summarizeChanges(changes = []) {
  return changes.reduce((acc, change) => {
    acc.total += 1;
    acc[change.type] = (acc[change.type] || 0) + 1;
    return acc;
  }, { total: 0, added: 0, removed: 0, changed: 0, 'array-length': 0 });
}

export function formatMarkdown(changes = []) {
  if (!changes.length) return 'No JSON differences found.';
  const summary = summarizeChanges(changes);
  const lines = [
    '# JSON diff report',
    '',
    `Total changes: ${summary.total}`,
    '',
    '| Type | Path | Before | After |',
    '| --- | --- | --- | --- |',
  ];
  for (const change of changes) {
    lines.push(`| ${change.type} | \`${change.path}\` | \`${JSON.stringify(change.before)}\` | \`${JSON.stringify(change.after)}\` |`);
  }
  return lines.join('\n');
}
