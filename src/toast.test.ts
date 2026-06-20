import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createToastController, type ToastState } from './toast'

describe('createToastController', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls onShow with the correct message and type', () => {
    const onShow = vi.fn<(state: ToastState) => void>()
    const onHide = vi.fn<() => void>()
    const controller = createToastController(onShow, onHide, 2500)

    controller.show('Link copiado!', 'success')

    expect(onShow).toHaveBeenCalledOnce()
    expect(onShow).toHaveBeenCalledWith({ message: 'Link copiado!', type: 'success' })
  })

  it('defaults type to "success" when omitted', () => {
    const onShow = vi.fn<(state: ToastState) => void>()
    const onHide = vi.fn<() => void>()
    const controller = createToastController(onShow, onHide, 2500)

    controller.show('Olá')

    expect(onShow).toHaveBeenCalledWith({ message: 'Olá', type: 'success' })
  })

  it('calls onHide after the specified duration', () => {
    const onShow = vi.fn<(state: ToastState) => void>()
    const onHide = vi.fn<() => void>()
    const controller = createToastController(onShow, onHide, 1000)

    controller.show('Mensagem', 'error')
    expect(onHide).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1000)
    expect(onHide).toHaveBeenCalledOnce()
  })

  it('resets the timer when show is called again before duration expires', () => {
    const onShow = vi.fn<(state: ToastState) => void>()
    const onHide = vi.fn<() => void>()
    const controller = createToastController(onShow, onHide, 1000)

    controller.show('Primeiro')
    vi.advanceTimersByTime(500)

    controller.show('Segundo')
    vi.advanceTimersByTime(500)

    // onHide should NOT have been called yet (timer was reset)
    expect(onHide).not.toHaveBeenCalled()

    vi.advanceTimersByTime(500)
    expect(onHide).toHaveBeenCalledOnce()
  })
})
