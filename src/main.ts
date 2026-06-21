import './style.css'
import Alpine from 'alpinejs'
import focus from '@alpinejs/focus'
import { sanitize, isValid, toWaUrl } from './phone'
import { renderQr, clearQr } from './qr'
import { createToastController, type ToastType } from './toast'

// ── Alpine component types ────────────────────────────────────────────────────

// Properties and methods exposed by the component object literal.
interface ZZLinkState {
  rawPhone: string
  link: string
  error: string
  copied: boolean
  showQr: boolean
  toast: string
  toastType: ToastType
  canShare: boolean
  _copyTimer: ReturnType<typeof setTimeout> | null
  init(): void
  onPhoneInput(): void
  generateLink(): void
  clearField(): void
  copyLink(): Promise<void>
  openWhatsApp(): void
  shareLink(): Promise<void>
}

// Extends ZZLinkState with Alpine magic properties injected at runtime.
interface ZZLinkData extends ZZLinkState {
  $watch(prop: string, callback: (isActive: boolean) => void): void
  $nextTick(callback: () => void): void
}

declare global {
  interface Window {
    zzlink: () => ZZLinkState
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

window.zzlink = function (): ZZLinkState {
  // toast controller is wired to Alpine reactive state inside init()
  let toastCtrl: ReturnType<typeof createToastController> | null = null

  return {
    rawPhone: '',
    link: '',
    error: '',
    copied: false,
    showQr: false,
    toast: '',
    toastType: 'success',
    canShare: false,
    _copyTimer: null,

    init(this: ZZLinkData): void {
      this.canShare = typeof navigator.share === 'function'

      toastCtrl = createToastController(
        ({ message, type }) => {
          this.toast = message
          this.toastType = type
        },
        () => {
          this.toast = ''
        },
      )

      this.$watch('showQr', (isActive) => {
        if (isActive) {
          this.$nextTick(() => {
            void renderQr('qr-container', this.link)
          })
        } else {
          clearQr('qr-container')
        }
      })
    },

    onPhoneInput(this: ZZLinkData): void {
      this.error = ''
      this.link = ''
      this.copied = false
      if (sanitize(this.rawPhone).length >= 10) {
        this.link = toWaUrl(this.rawPhone)
      }
    },

    generateLink(this: ZZLinkData): void {
      if (!isValid(this.rawPhone)) {
        this.error = 'Número inválido. Mínimo 10 dígitos.'
        return
      }
      this.link = toWaUrl(this.rawPhone)
      this.error = ''
    },

    clearField(this: ZZLinkData): void {
      this.rawPhone = ''
      this.link = ''
      this.error = ''
      this.copied = false
      this.showQr = false
    },

    async copyLink(this: ZZLinkData): Promise<void> {
      if (!this.link) return
      try {
        await navigator.clipboard.writeText(this.link)
        this.copied = true
        toastCtrl?.show('Link copiado!', 'success')
        if (this._copyTimer) clearTimeout(this._copyTimer)
        this._copyTimer = setTimeout(() => {
          this.copied = false
        }, 2500)
      } catch {
        toastCtrl?.show('Falha ao copiar.', 'error')
      }
    },

    openWhatsApp(this: ZZLinkData): void {
      if (this.link) window.open(this.link, '_blank', 'noopener,noreferrer')
    },

    async shareLink(this: ZZLinkData): Promise<void> {
      if (!this.link || !this.canShare) return
      try {
        await navigator.share({ title: 'ZZLink', url: this.link })
      } catch {
        // user cancelled — no feedback needed
      }
    },
  }
}

Alpine.plugin(focus)
Alpine.start()
