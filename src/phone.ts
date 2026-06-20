const BRAZIL_CODE = '55'
const MIN_DIGITS = 10
const MAX_DIGITS = 20

export function sanitize(phone: string): string {
  return phone.replaceAll(/\D/g, '')
}

export function isValid(phone: string): boolean {
  const d = sanitize(phone).length
  return d >= MIN_DIGITS && d <= MAX_DIGITS
}

export function toWaUrl(phone: string): string {
  const digits = sanitize(phone)
  const withCode = digits.startsWith(BRAZIL_CODE) ? digits : `${BRAZIL_CODE}${digits}`
  return `https://wa.me/${withCode}`
}
