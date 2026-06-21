import './style.css'
import Alpine from 'alpinejs'
import focus from '@alpinejs/focus'
import { sanitize, toWaUrl, maskPhone, maskPhoneGeneric } from './phone'
import { renderQr, clearQr, downloadQr } from './qr'
import { createToastController, type ToastType } from './toast'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Country {
  code: string
  name: string
  dial: string
  flag: string
}

interface HistoryItem {
  id: string
  link: string
  display: string
  ts: number
}

interface ZZLinkResult {
  link: string
  display: string
}

interface ZZLinkState {
  version: string
  countries: Country[]
  countryIdx: number
  countryOpen: boolean
  rawPhone: string
  message: string
  showMessage: boolean
  result: ZZLinkResult | null
  error: string
  copied: boolean
  showQr: boolean
  toast: string
  toastType: ToastType
  history: HistoryItem[]
  init(): void
  selectedCountry(): Country
  phonePlaceholder(): string
  formattedPhone(): string
  onPhoneInput(event: Event): void
  toggleCountry(): void
  selectCountry(idx: number): void
  toggleMessage(): void
  generate(): void
  clearInput(): void
  copyLink(text: string): Promise<void>
  openWhatsApp(): void
  shareLink(): Promise<void>
  openQr(): void
  closeQr(): void
  downloadQrCode(): void
  clearHistory(): void
  deleteHistoryItem(id: string): void
  relativeTime(ts: number): string
}

interface ZZLinkData extends ZZLinkState {
  $watch(prop: string, callback: (value: unknown) => void): void
  $nextTick(callback: () => void): void
}

declare global {
  interface Window {
    zzlink: () => ZZLinkState
  }
}

// ── Constants ─────────────────────────────────────────────────────────────────

const COUNTRIES: Country[] = [
  { code: 'BR', name: 'Brasil', dial: '55', flag: '🇧🇷' },
  { code: 'US', name: 'Estados Unidos', dial: '1', flag: '🇺🇸' },
  { code: 'PT', name: 'Portugal', dial: '351', flag: '🇵🇹' },
  { code: 'AR', name: 'Argentina', dial: '54', flag: '🇦🇷' },
  { code: 'MX', name: 'México', dial: '52', flag: '🇲🇽' },
  { code: 'ES', name: 'Espanha', dial: '34', flag: '🇪🇸' },
  { code: 'CO', name: 'Colômbia', dial: '57', flag: '🇨🇴' },
  { code: 'GB', name: 'Reino Unido', dial: '44', flag: '🇬🇧' },
]

const HISTORY_KEY = 'zzlink_history'
const HISTORY_MAX = 20
const COPY_FEEDBACK_MS = 1600

// ── Component ─────────────────────────────────────────────────────────────────

window.zzlink = function (): ZZLinkState {
  let toastCtrl: ReturnType<typeof createToastController> | null = null

  return {
    version: __APP_VERSION__,
    countries: COUNTRIES,
    countryIdx: 0,
    countryOpen: false,
    rawPhone: '',
    message: '',
    showMessage: false,
    result: null,
    error: '',
    copied: false,
    showQr: false,
    toast: '',
    toastType: 'success',
    history: [],

    init(this: ZZLinkData): void {
      try {
        const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]') as unknown
        if (Array.isArray(stored)) this.history = stored as HistoryItem[]
      } catch {
        // corrupted storage — start fresh
      }

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
            renderQr('qr-container', this.result?.link ?? '')
          })
        } else {
          clearQr('qr-container')
        }
      })

      document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key !== 'Escape') {
          return
        }

        this.countryOpen = false
        this.showQr = false
      })
    },

    selectedCountry(this: ZZLinkData): Country {
      return this.countries[this.countryIdx]
    },

    phonePlaceholder(this: ZZLinkData): string {
      return this.selectedCountry().code === 'BR' ? '(11) 91234-5678' : 'Número'
    },

    formattedPhone(this: ZZLinkData): string {
      const country = this.selectedCountry()
      const digits = sanitize(this.rawPhone)
      return (country.code === 'BR' ? maskPhone : maskPhoneGeneric)(digits)
    },

    onPhoneInput(this: ZZLinkData, event: Event): void {
      const input = event.target as HTMLInputElement
      const country = this.selectedCountry()
      const max = country.code === 'BR' ? 11 : 15
      const digits = sanitize(input.value).slice(0, max)
      this.rawPhone = digits
      this.error = ''
      this.result = null

      const formatted = this.formattedPhone()
      const cursorDigits = sanitize(
        input.value.slice(0, input.selectionEnd ?? input.value.length),
      ).length

      input.value = formatted
      // Restore cursor position by counting digits up to the old cursor
      let seen = 0
      let newCursor = formatted.length
      let i = 0
      for (const ch of formatted) {
        if (/\d/.test(ch)) seen++
        if (seen === cursorDigits) {
          newCursor = i + 1
          break
        }
        i++
      }
      input.setSelectionRange(newCursor, newCursor)
    },

    toggleCountry(this: ZZLinkData): void {
      this.countryOpen = !this.countryOpen
    },

    selectCountry(this: ZZLinkData, idx: number): void {
      this.countryIdx = idx
      this.countryOpen = false
      this.rawPhone = ''
      this.result = null
      this.error = ''
    },

    toggleMessage(this: ZZLinkData): void {
      this.showMessage = !this.showMessage
      if (!this.showMessage) this.message = ''
    },

    generate(this: ZZLinkData): void {
      const country = this.selectedCountry()
      const min = country.code === 'BR' ? 10 : 7
      if (this.rawPhone.length < min) {
        this.error = 'Número incompleto. Confira o DDD e o número.'
        this.result = null
        return
      }
      const link = toWaUrl(`${country.dial}${this.rawPhone}`, this.message)
      const display = `+${country.dial} ${this.formattedPhone()}`
      this.result = { link, display }
      this.error = ''
      this.copied = false

      const item: HistoryItem = { id: String(Date.now()), link, display, ts: Date.now() }
      this.history = [item, ...this.history.filter((h) => h.link !== link)].slice(0, HISTORY_MAX)
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(this.history))
      } catch {
        /* quota exceeded */
      }
    },

    clearInput(this: ZZLinkData): void {
      this.rawPhone = ''
      this.result = null
      this.error = ''
      this.message = ''
      this.showMessage = false
      this.showQr = false
      this.copied = false
    },

    async copyLink(this: ZZLinkData, text: string): Promise<void> {
      try {
        await navigator.clipboard.writeText(text)
        this.copied = true
        toastCtrl?.show('Link copiado!', 'success')
        setTimeout(() => {
          this.copied = false
        }, COPY_FEEDBACK_MS)
      } catch {
        toastCtrl?.show('Falha ao copiar.', 'error')
      }
    },

    openWhatsApp(this: ZZLinkData): void {
      if (this.result) window.open(this.result.link, '_blank', 'noopener,noreferrer')
    },

    async shareLink(this: ZZLinkData): Promise<void> {
      if (!this.result) return
      if ('share' in navigator) {
        try {
          await navigator.share({ title: 'Link do WhatsApp', url: this.result.link })
        } catch {
          /* cancelled */
        }
      } else {
        await this.copyLink(this.result.link)
      }
    },

    openQr(this: ZZLinkData): void {
      this.showQr = true
    },

    closeQr(this: ZZLinkData): void {
      this.showQr = false
    },

    downloadQrCode(): void {
      downloadQr('qr-container')
    },

    clearHistory(this: ZZLinkData): void {
      this.history = []
      try {
        localStorage.setItem(HISTORY_KEY, '[]')
      } catch {
        /* quota exceeded */
      }
    },

    deleteHistoryItem(this: ZZLinkData, id: string): void {
      this.history = this.history.filter((h) => h.id !== id)
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(this.history))
      } catch {
        /* quota exceeded */
      }
    },

    relativeTime(ts: number): string {
      const s = (Date.now() - ts) / 1000
      if (s < 60) return 'agora'
      if (s < 3600) return `há ${String(Math.floor(s / 60))} min`
      if (s < 86_400) return `há ${String(Math.floor(s / 3600))} h`
      if (s < 172_800) return 'ontem'
      return new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    },
  }
}

Alpine.plugin(focus)
Alpine.start()
