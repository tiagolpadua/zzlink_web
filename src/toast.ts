export type ToastType = 'success' | 'error'

export interface ToastState {
  message: string
  type: ToastType
}

export function createToastController(
  onShow: (state: ToastState) => void,
  onHide: () => void,
  durationMs = 2500,
): { show: (message: string, type?: ToastType) => void } {
  let timer: ReturnType<typeof setTimeout> | null = null

  return {
    show(message: string, type: ToastType = 'success'): void {
      if (timer) clearTimeout(timer)
      onShow({ message, type })
      timer = setTimeout(() => {
        onHide()
        timer = null
      }, durationMs)
    },
  }
}
