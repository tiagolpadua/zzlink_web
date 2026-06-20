# ZZLink

Gerador de links para o WhatsApp. Digite um número de telefone brasileiro e obtenha um link `wa.me` pronto para copiar, compartilhar ou abrir diretamente no WhatsApp.

**[→ Abrir no GitHub Pages](https://tiagolpadua.github.io/zzlink_web)**

## Funcionalidades

- Geração automática do link ao digitar (mínimo 10 dígitos)
- Prefixo `+55` aplicado automaticamente quando ausente
- Copiar link para o clipboard
- Abrir diretamente no WhatsApp
- Compartilhar via Web Share API (mobile)
- QR Code do link gerado
- Layout responsivo mobile-first

## Stack

| Camada | Tecnologia |
|---|---|
| Build | [Vite](https://vitejs.dev/) |
| Linguagem | TypeScript (strict) |
| Reatividade | [Alpine.js](https://alpinejs.dev/) via CDN |
| QR Code | [QRCode.js](https://davidshimjs.github.io/qrcodejs/) via CDN |
| Testes | [Vitest](https://vitest.dev/) |
| Linting | ESLint + typescript-eslint + unicorn |
| Formatação | Prettier |
| Git hooks | Husky + lint-staged |

Zero dependências de runtime no npm — Alpine.js e QRCode.js são carregados via CDN.

## Desenvolvimento

```bash
npm install
npm run dev        # http://localhost:5173
```

### Scripts disponíveis

```bash
npm run build          # Verifica tipos (tsc) e gera dist/
npm run preview        # Serve o build de produção localmente

npm run lint           # ESLint em src/
npm run lint:fix       # ESLint com auto-fix
npm run format         # Prettier em src/ e index.html
npm run format:check   # Verifica formatação sem alterar arquivos

npm test               # Vitest (execução única)
npm run test:watch     # Vitest em modo watch
npm run test:coverage  # Vitest com relatório de cobertura V8
```

Para rodar um único arquivo de testes:

```bash
npx vitest run src/phone.test.ts
```

### Pré-requisitos

- Node.js ≥ 18
- npm ≥ 9

## Estrutura

```
zzlink_web/
├── src/
│   ├── main.ts        # Componente Alpine.js — wiring de estado e ações
│   ├── phone.ts       # Lógica de validação e geração de URL (pura, sem DOM)
│   ├── qr.ts          # Wrapper do QRCode.js (CDN global)
│   ├── toast.ts       # Controlador de notificações (puro, sem DOM)
│   └── style.css      # Tema WhatsApp verde, processado pelo Vite
├── index.html         # Markup Alpine.js com x-data="zzlink()"
├── vite.config.ts
├── tsconfig.app.json  # TypeScript para src/ (noEmit)
└── tsconfig.node.json # TypeScript para arquivos de config
```

## Como funciona

`window.zzlink` é registrado em `src/main.ts` e referenciado pelo `index.html` via `x-data="zzlink()"`. O Alpine.js (CDN) torna o objeto retornado reativo — sem build step de framework, sem virtual DOM.

A lógica de negócio fica exclusivamente em `phone.ts` (funções puras, totalmente testadas). O `main.ts` faz apenas o wiring entre essas funções e o estado reativo do Alpine.

## Licença

MIT © [Tiago Lage Payne de Pádua](https://github.com/tiagolpadua)
