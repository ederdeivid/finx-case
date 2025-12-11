export default function queryString(params: Record<string, never>): string {
  const filteredEntries = Object.entries(params).filter(([_key, value]) => {
    return value !== null && value !== undefined && value !== ''
  })

  const noEmptyValues = Object.fromEntries(filteredEntries)
  return new URLSearchParams(noEmptyValues).toString()
}