export function diffKeys(before = {}, after = {}) {
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  return [...keys].filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(diffKeys({ name: 'Imran', city: 'Nairobi' }, { name: 'Imran', city: 'Kisumu' }));
}
