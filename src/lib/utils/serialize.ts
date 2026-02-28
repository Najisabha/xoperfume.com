
export function serializeDocument<T>(doc: any): T {
  return JSON.parse(JSON.stringify(doc))
}