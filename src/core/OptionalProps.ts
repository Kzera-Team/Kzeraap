export function setIfDefined<T extends object, K extends string, V>(
  target: T,
  key: K,
  value: V | undefined
): T & Partial<Record<K, V>> {
  if (value === undefined) return target;
  return Object.assign(target, { [key]: value });
}
