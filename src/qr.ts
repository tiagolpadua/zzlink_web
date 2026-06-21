import QRCode from 'qrcode'

export async function renderQr(containerId: string, text: string): Promise<void> {
  const element = document.querySelector<HTMLCanvasElement>(`#${containerId}`)
  if (!element) return
  await QRCode.toCanvas(element, text, {
    width: 220,
    color: { dark: '#075E54', light: '#ffffff' },
    errorCorrectionLevel: 'H',
  })
}

export function clearQr(containerId: string): void {
  const element = document.querySelector<HTMLCanvasElement>(`#${containerId}`)
  if (!element) return
  const context = element.getContext('2d')
  if (context) context.clearRect(0, 0, element.width, element.height)
}
