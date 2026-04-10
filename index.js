const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

export function diffJson(before = {}, after = {}, path = '') {
  const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
  const changes = [];

  for (const key of keys) {
    const nextPath = path ? `${path}.${key}` : key;
    const left = before?.[key];
    const right = after?.[key];

    if (!(key in (before || {}))) {
      changes.push({ type: 'added', path: nextPath, before: undefined, after: right });
      continue;
    }
    if (!(key in (after || {}))) {
      changes.push({ type: 'removed', path: nextPath, before: left, after: undefined });
      continue;
    }
    if (isObject(left) && isObject(right)) {
      changes.push(...diffJson(left, right, nextPath));
      continue;
    }
    if (JSON.stringify(left) !== JSON.stringify(right)) {
      changes.push({ type: 'changed', path: nextPath, before: left, after: right });
    }
  }

  return changes;
}

export function summarizeChanges(changes = []) {
  return changes.reduce((acc, change) => {
    acc[change.type] = (acc[change.type] || 0) + 1;
    return acc;
  }, { added: 0, removed: 0, changed: 0 });
}
