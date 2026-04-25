import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchJson } from './http'

describe('fetchJson', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('builds query params and omits nullish and empty string values', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ ok: true }),
    } as unknown as Response)

    await fetchJson('https://example.com/weather', {
      q: 'Helsinki',
      page: 0,
      includeHourly: false,
      empty: '',
      nil: null,
      undef: undefined,
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://example.com/weather?q=Helsinki&page=0&includeHourly=false',
    )
  })

  it('throws with response status when request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 503,
    } as Response)

    await expect(fetchJson('https://example.com/weather')).rejects.toThrow(
      'Request failed with status 503',
    )
  })

  it('returns decoded JSON payload', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ temperature: 17 }),
    } as unknown as Response)

    await expect(fetchJson<{ temperature: number }>('https://example.com/weather')).resolves.toEqual({
      temperature: 17,
    })
  })
})
