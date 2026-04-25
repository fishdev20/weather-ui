export type QueryParams = Record<string, string | number | boolean | null | undefined>

function buildUrl(url: string, params?: QueryParams): string {
  if (!params) {
    return url
  }

  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') {
      continue
    }

    searchParams.set(key, String(value))
  }

  const query = searchParams.toString()
  return query ? `${url}?${query}` : url
}

export async function fetchJson<T>(url: string, params?: QueryParams): Promise<T> {
  const response = await fetch(buildUrl(url, params))

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}
