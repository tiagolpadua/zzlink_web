# Changelog

Todas as mudanças notáveis deste projeto são documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)
e o projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [1.0.2] — 2026-06-21

### Melhorado

- **Performance:** fontes do Google Fonts carregadas de forma não-bloqueante (`media="print"` + `onload`) para reduzir render-blocking.
- **Performance:** `qrious.min.js` carregado com `defer`, eliminando bloqueio de renderização inicial.
- **Acessibilidade:** cores de texto secundário (`#9AA7A0`) substituídas por `#697870` (contraste 4.64:1, aprovado no WCAG AA) em placeholder, estado vazio do histórico e botão "Limpar".
- **CLS:** `zz-btn-primary` recebeu `min-height: 54px` explícito para reservar espaço antes da hidratação do Alpine, reduzindo layout shift.
- **Performance:** `box-shadow` do botão primário movido para pseudo-elemento `::after` com transição de `opacity`, mantendo a animação no compositor e fora da main thread.

### Corrigido

- Erros de lint: `unicorn/prefer-minimal-ternary`, `unicorn/no-for-loop`, `@typescript-eslint/no-unnecessary-condition`, `@typescript-eslint/no-deprecated` (`execCommand`) e `@typescript-eslint/restrict-template-expressions`.
- Removido fallback `document.execCommand('copy')` (depreciado); `navigator.clipboard` é universal nos targets modernos.
- Verificação de `navigator.share` corrigida para `'share' in navigator` (evitava falso positivo do lint).

---

## [1.0.1] — 2026-06-21

### Adicionado

- **Versão dinâmica:** número de versão no header sincronizado automaticamente com `package.json` via `define` do Vite (`__APP_VERSION__`), sem mais valor fixo em HTML.
- **Máscara de telefone:** função `maskPhone` aplicada em tempo real no input, formatando como `(XX) XXXXX-XXXX` (celular) ou `(XX) XXXX-XXXX` (fixo), com restauração correta do cursor.
- Testes unitários para `maskPhone` (7 casos) em `phone.test.ts`.

### Melhorado

- `toWaUrl` aceita parâmetro `message` opcional, gerando links com `?text=` quando preenchido.
- `maskPhoneGeneric` para países não-BR (agrupamento a cada 3 dígitos).

---

## [1.0.0] — 2026-06-21

### Adicionado

- **Redesign completo** seguindo o design handoff em esmeralda (Space Grotesk + Manrope, paleta `#0B6B4A → #16A36F`).
- **Seletor de país** com dropdown (BR, US, PT, AR, MX, ES, CO, GB); máscara de input adaptada por país.
- **Campo de mensagem opcional** expansível com textarea; gera link com `?text=encodeURIComponent(msg)`.
- **Histórico de links** persistido em `localStorage` (chave `zzlink_history`, máx. 20 itens, sem duplicatas). Exibe tempo relativo ("agora", "há N min", "há N h", "ontem", dd/mm) e permite copiar ou excluir individualmente.
- **Download PNG do QR Code** via botão "Baixar PNG" no modal.
- **Layout de duas colunas** responsivo (Generator + History), empilhando em telas estreitas.
- Animações de entrada: `zzPop`, `zzFade`, `zzModal` com `cubic-bezier(.2,.8,.2,1)`.
- Indicador de status pulsante no card de resultado ("SEU LINK ESTÁ PRONTO").

### Melhorado

- QR Code migrado de `qrcode` (npm) para **QRious** (CDN), com `fg: #0F1E18`, `240×240px`, nível `M`.
- CSS próprio (`zz-*`) substituindo o Tailwind CDN: tokens de design documentados como variáveis de escopo.
- Header fixo com efeito de vidro (`backdrop-filter: blur(8px)`).
- Fundo da página com gradiente radial verde (`radial-gradient`).

---

## [0.2.0] — 2026-06-21

### Adicionado

- Migração visual para **Tailwind CSS** via CDN com config customizada (cores `wa-dark`, `wa-mid`, `wa-bright`, `wa-pale`).
- Alpine.js integrado via npm (`alpinejs` + `@alpinejs/focus`) em substituição ao CDN.

### Melhorado

- QR Code reescrito usando a lib `qrcode` npm com `canvas`, substituindo manipulação de DOM.
- `@alpinejs/focus` adicionado para gestão de foco no modal (`x-trap`).

---

## [0.1.0] — 2026-06-19

### Adicionado

- Estrutura inicial do projeto com Vite + TypeScript + ESLint (flat config).
- `.editorconfig`, `README.md`, `LICENSE` (MIT).
- Módulos base:
  - `src/phone.ts` — `sanitize`, `isValid`, `toWaUrl` (funções puras, sem DOM).
  - `src/toast.ts` — `createToastController` (factory de timer para show/hide).
  - `src/qr.ts` — wrapper do QRCode.js.
  - `src/main.ts` — componente Alpine registrado em `window.zzlink`.
- Testes unitários com Vitest (cobertura V8) para `phone.ts` e `toast.ts`.
- Pre-commit hook (Husky + lint-staged): ESLint fix + Prettier em `.ts` e `.html`.
- Prettier configurado como regra ESLint (`eslint-plugin-prettier`).
- `tsconfig` split em `app` / `node` seguindo padrão recomendado do Vite.
