/**
 * rebuild the wheel though
 * TODO test
 * @param elems 
 * @param key 
 */
export function deduplicate<T, S>(elems: T[], key: (value: T) => S): T[] {
  const dedupeSet = new Set(elems.map(val => key(val)));
  return elems.filter(val => dedupeSet.delete(key(val)))
}
