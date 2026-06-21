// QRious is loaded from CDN — no npm package exists.
declare const QRious: new (options: {
  element: HTMLCanvasElement
  value: string
  size: number
  level: string
  foreground: string
  background: string
}) => void

export function renderQr(containerId: string, text: string): void {
  const element = document.querySelector<HTMLCanvasElement>(`#${containerId}`)
  if (!element) return
  new QRious({
    element,
    value: text,
    size: 240,
    level: 'M',
    foreground: '#0F1E18',
    background: '#ffffff',
  })
}

export function clearQr(containerId: string): void {
  const element = document.querySelector<HTMLCanvasElement>(`#${containerId}`)
  if (!element) return
  const ctx = element.getContext('2d')
  if (ctx) ctx.clearRect(0, 0, element.width, element.height)
}

export function downloadQr(containerId: string, filename = 'zzlink-qr.png'): void {
  const element = document.querySelector<HTMLCanvasElement>(`#${containerId}`)
  if (!element) return
  const a = document.createElement('a')
  a.href = element.toDataURL('image/png')
  a.download = filename
  a.click()
}
