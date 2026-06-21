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

export function toWaUrl(phone: string, message?: string): string {
  const digits = sanitize(phone)
  const withCode = digits.startsWith(BRAZIL_CODE) ? digits : `${BRAZIL_CODE}${digits}`
  const base = `https://wa.me/${withCode}`
  return message?.trim() ? `${base}?text=${encodeURIComponent(message.trim())}` : base
}

// Applies BR phone mask: (XX) XXXXX-XXXX for mobile (11 digits), (XX) XXXX-XXXX for landline.
export function maskPhone(raw: string): string {
  const d = sanitize(raw).slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return d.replace(/^(\d{0,2})/, '($1')
  if (d.length <= 6) return d.replace(/^(\d{2})(\d+)/, '($1) $2')
  if (d.length <= 10) return d.replace(/^(\d{2})(\d{4})(\d+)/, '($1) $2-$3')
  return d.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}

// Groups digits in sets of 3 for non-BR countries (e.g. "123 456 789").
export function maskPhoneGeneric(raw: string): string {
  const d = sanitize(raw).slice(0, 15)
  return d.replaceAll(/(\d{3})(?=\d)/g, '$1 ').trim()
}
