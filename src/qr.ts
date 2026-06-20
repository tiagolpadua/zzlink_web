declare const QRCode: {
  new (
    element: HTMLElement,
    options: {
      text: string
      width: number
      height: number
      colorDark: string
      colorLight: string
      correctLevel: number
    },
  ): unknown
  CorrectLevel: { H: number }
}

export function renderQr(containerId: string, text: string): void {
  const element = document.querySelector<HTMLElement>(`#${containerId}`)
  if (!element) return
  element.innerHTML = ''
  new QRCode(element, {
    text,
    width: 220,
    height: 220,
    colorDark: '#075E54',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H,
  })
}

export function clearQr(containerId: string): void {
  const element = document.querySelector(`#${containerId}`)
  if (element) element.innerHTML = ''
}
