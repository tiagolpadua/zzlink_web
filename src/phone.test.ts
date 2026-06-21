import { describe, it, expect } from 'vitest'
import { sanitize, isValid, toWaUrl, maskPhone } from './phone'

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

describe('maskPhone', () => {
  it('formats a mobile number (11 digits)', () => {
    expect(maskPhone('11999999999')).toBe('(11) 99999-9999')
  })

  it('formats a landline number (10 digits)', () => {
    expect(maskPhone('1133334444')).toBe('(11) 3333-4444')
  })

  it('applies mask progressively while typing', () => {
    expect(maskPhone('1')).toBe('(1')
    expect(maskPhone('11')).toBe('(11')
    expect(maskPhone('119')).toBe('(11) 9')
    expect(maskPhone('11999')).toBe('(11) 999')
    expect(maskPhone('119999')).toBe('(11) 9999')
    expect(maskPhone('1199999')).toBe('(11) 9999-9')
    expect(maskPhone('11999999999')).toBe('(11) 99999-9999')
  })

  it('strips non-digits from input', () => {
    expect(maskPhone('(11) 99999-9999')).toBe('(11) 99999-9999')
  })

  it('caps at 11 digits', () => {
    expect(maskPhone('119999999991234')).toBe('(11) 99999-9999')
  })

  it('returns empty string for empty input', () => {
    expect(maskPhone('')).toBe('')
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
