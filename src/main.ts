import './style.css'
import { sanitize, isValid, toWaUrl } from './phone'
import { renderQr, clearQr } from './qr'
import { type ToastType } from './toast'

interface AlpineThis {
  rawPhone: string
  link: string
  error: string
  copied: boolean
  showQr: boolean
  toast: string
  toastType: ToastType
  canShare: boolean
  _copyTimer: ReturnType<typeof setTimeout> | null
  _toastTimer: ReturnType<typeof setTimeout> | null
  $watch(prop: string, callback: (isActive: boolean) => void): void
  $nextTick(callback: () => void): void
  _showToast(message: string, type: ToastType): void
}

declare global {
  interface Window {
    zzlink: () => Record<string, unknown>
  }
}

window.zzlink = function (): Record<string, unknown> {
  return {
    rawPhone: '',
    link: '',
    error: '',
    copied: false,
    showQr: false,
    toast: '',
    toastType: 'success' satisfies ToastType,
    canShare: false,
    _copyTimer: null as ReturnType<typeof setTimeout> | null,
    _toastTimer: null as ReturnType<typeof setTimeout> | null,

    init(this: AlpineThis): void {
      this.canShare = typeof navigator.share === 'function'
      this.$watch('showQr', (isActive) => {
        if (isActive) {
          this.$nextTick(() => {
            renderQr('qr-container', this.link)
          })
        } else {
          clearQr('qr-container')
        }
      })
    },

    onPhoneInput(this: AlpineThis): void {
      this.error = ''
      this.link = ''
      this.copied = false
      if (sanitize(this.rawPhone).length >= 10) {
        this.link = toWaUrl(this.rawPhone)
      }
    },

    generateLink(this: AlpineThis): void {
      if (!isValid(this.rawPhone)) {
        this.error = 'Número inválido. Mínimo 10 dígitos.'
        return
      }
      this.link = toWaUrl(this.rawPhone)
      this.error = ''
    },

    clearField(this: AlpineThis): void {
      this.rawPhone = ''
      this.link = ''
      this.error = ''
      this.copied = false
      this.showQr = false
    },

    async copyLink(this: AlpineThis): Promise<void> {
      if (!this.link) return
      try {
        await navigator.clipboard.writeText(this.link)
        this.copied = true
        this._showToast('Link copiado!', 'success')
        if (this._copyTimer) clearTimeout(this._copyTimer)
        this._copyTimer = setTimeout(() => {
          this.copied = false
        }, 2500)
      } catch {
        this._showToast('Falha ao copiar.', 'error')
      }
    },

    openWhatsApp(this: AlpineThis): void {
      if (this.link) window.open(this.link, '_blank', 'noopener,noreferrer')
    },

    async shareLink(this: AlpineThis): Promise<void> {
      if (!this.link || !this.canShare) return
      try {
        await navigator.share({ title: 'ZZLink', url: this.link })
      } catch {
        // user cancelled — no feedback needed
      }
    },

    _showToast(this: AlpineThis, message: string, type: ToastType): void {
      this.toast = message
      this.toastType = type
      if (this._toastTimer) clearTimeout(this._toastTimer)
      this._toastTimer = setTimeout(() => {
        this.toast = ''
      }, 2500)
    },
  }
}
