import { describe, it, expect } from 'vitest'
import { sanitize, isValid, toWaUrl } from './phone'

describe('sanitize', () => {
  it('removes non-digit characters', () => {
    expect(sanitize('(11) 99999-9999')).toBe('11999999999')
  })

  it('returns only digits from a clean number', () => {
    expect(sanitize('11999999999')).toBe('11999999999')
  })

  it('handles an empty string', () => {
    expect(sanitize('')).toBe('')
  })
})

describe('isValid', () => {
  it('accepts a valid 11-digit number', () => {
    expect(isValid('11999999999')).toBe(true)
  })

  it('accepts a number with formatting characters', () => {
    expect(isValid('(11) 99999-9999')).toBe(true)
  })

  it('accepts a number that already has the country code (13 digits)', () => {
    expect(isValid('5511999999999')).toBe(true)
  })

  it('rejects a number with fewer than 10 digits', () => {
    expect(isValid('123456789')).toBe(false)
  })

  it('rejects an empty string', () => {
    expect(isValid('')).toBe(false)
  })
})

describe('toWaUrl', () => {
  it('prepends Brazil country code when missing', () => {
    expect(toWaUrl('11999999999')).toBe('https://wa.me/5511999999999')
  })

  it('does not double-prepend when country code is already present', () => {
    expect(toWaUrl('5511999999999')).toBe('https://wa.me/5511999999999')
  })

  it('strips formatting before building the URL', () => {
    expect(toWaUrl('(11) 99999-9999')).toBe('https://wa.me/5511999999999')
  })
})
