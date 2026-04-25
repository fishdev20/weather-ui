import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useDebouncedValue } from './useDebouncedValue'

describe('useDebouncedValue', () => {
  it('keeps old value until delay passes and then updates', () => {
    vi.useFakeTimers()

    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'a' },
    })

    expect(result.current).toBe('a')

    rerender({ value: 'ab' })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(299)
    })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('ab')

    vi.useRealTimers()
  })

  it('clears previous timer when value changes rapidly', () => {
    vi.useFakeTimers()

    const clearSpy = vi.spyOn(window, 'clearTimeout')
    const { rerender } = renderHook(({ value }) => useDebouncedValue(value, 200), {
      initialProps: { value: 'x' },
    })

    rerender({ value: 'xy' })
    rerender({ value: 'xyz' })

    expect(clearSpy).toHaveBeenCalled()

    vi.useRealTimers()
  })
})
