# Handoff: ZZLink — Gerador de links do WhatsApp

## Overview
Redesenho da aplicação ZZLink, que converte um número de telefone em um link `wa.me`
pronto para compartilhar (similar ao create.wa.link). O redesign cria uma identidade
visual coesa em esmeralda, organiza a hierarquia da tela e adiciona estados (vazio /
gerado / erro), QR Code em modal e histórico de links.

## About the Design Files
Os arquivos deste pacote são **referências de design feitas em HTML** — protótipos que
mostram o visual e o comportamento pretendidos, **não** código de produção para copiar
diretamente. A tarefa é **recriar este design no ambiente do seu projeto** (React, Vue,
PHP, etc.), usando os padrões e bibliotecas que você já tem. O arquivo
`ZZLink-reference.html` é autossuficiente e abre em qualquer navegador (inclusive offline)
para servir de referência pixel a pixel — use-o como espelho visual, mas implemente com a
sua stack.

## Fidelity
**Alta fidelidade (hifi).** Cores, tipografia, espaçamento e interações são finais.
Recrie a UI fielmente usando os componentes/estilos do seu codebase.

---

## Layout geral
- Fundo da página: `#EEF1EC` com um brilho radial no topo:
  `radial-gradient(1100px 520px at 50% -160px, #D8EFE2 0%, rgba(216,239,226,0) 60%)`.
- **Header** fixo (sticky), altura `64px`, fundo branco translúcido (`rgba(255,255,255,.7)` +
  `backdrop-filter: blur(8px)`), borda inferior `1px solid #E2E7E1`. Conteúdo centralizado,
  largura máx. `1040px`, padding lateral `28px`.
  - Esquerda: ícone (quadrado `38px`, radius `11px`, gradiente `linear-gradient(160deg,#13A06E,#0B6B4A)`,
    glifo de balão+link branco) + wordmark **"ZZLink"** (Space Grotesk 700, 18px) e
    subtítulo **"Gerador de links"** (11px, 600, `#5E8E78`).
  - Direita: chip **"v1.0"** (pílula branca, borda `#E2E7E1`, 12px/600, `#6B7A72`).
- **Main**: largura máx. `1040px`, padding `40px 28px 64px`, `display:flex; flex-wrap:wrap;
  gap:24px; align-items:flex-start`. Dois cartões:
  - **Generator** — `flex:1.7 1 360px; min-width:340px`.
  - **History** — `flex:1 1 280px; min-width:280px`.
  - Em telas estreitas eles empilham (wrap).
- Ambos os cartões: fundo `#fff`, borda `1px solid #E6EAE4`, radius `22px`,
  sombra `0 1px 2px rgba(16,30,24,.04), 0 18px 40px -28px rgba(16,30,24,.22)`.

---

## Screens / Views

### 1. Generator (cartão principal, padding 34px)
- **Título** "Gerar link do WhatsApp" — Space Grotesk 700, 26px, `letter-spacing:-0.5px`, `#0F1E18`.
- **Subtítulo** "Digite o número e crie um link **wa.me** pronto para compartilhar." —
  Manrope 15px, `#5C6B62`; "wa.me" em `#0B6B4A`/600.
- **Label** "Número de telefone" — 13px/600, `#3C4B43`, margem inferior 9px.
- **Linha do input** (`display:flex; gap:10px`):
  - **Seletor de país** (botão): altura `54px`, fundo `#F6F8F5`, borda `1.5px solid #E1E7E0`,
    radius `13px`. Mostra bandeira (emoji 18px) + `+{dial}` (15px/600) + chevron.
    Ao clicar abre dropdown (largura 230px, radius 14px, sombra forte, item hover `#F2F6F1`).
  - **Input tel**: `flex:1`, altura `54px`, padding `0 42px 0 16px`, fonte 17px/600,
    borda `1.5px solid #E1E7E0`, radius `13px`. **Foco**: borda `#13A06E` +
    `box-shadow:0 0 0 4px rgba(19,160,110,.13)`. Botão "x" (limpar) aparece à direita
    quando há texto (28px, fundo `#F0F2EF`, radius 8px).
- **Erro** (quando inválido): linha 13.5px/500 em `#D02B2B` com ícone de alerta, animação fade.
- **Toggle de mensagem**: link "Adicionar mensagem (opcional)" (13.5px/600, `#0B6B4A`, ícone +).
  Expande um `textarea` (3 linhas, fundo `#FAFBFA`, mesma borda/radius/foco do input).
- **Botão "Gerar link"**: largura total, altura `54px`, radius `14px`,
  fundo `linear-gradient(160deg,#15A371,#0C7A52)`, texto branco 16px/700,
  sombra `0 10px 22px -10px rgba(12,122,82,.7)`. Ícone de link à esquerda.
  Hover `filter:brightness(1.05)`, active `translateY(1px)`.

### 2. Estado "Link gerado" (aparece abaixo do botão)
- Cartão: `linear-gradient(180deg,#F0FAF4,#EAF7EF)`, borda `1.5px solid #CDEBDB`,
  radius `18px`, padding `20px`, animação de entrada `zzPop` (0.25s).
- Rótulo "SEU LINK ESTÁ PRONTO" (11.5px/700, `letter-spacing:1px`, `#0B6B4A`, uppercase)
  com bolinha de status verde pulsante.
- Linha do link: fundo `#fff`, borda `1px solid #D7EBDF`, radius `12px`. Link `wa.me`
  truncado (`#0C7A52`/600) + botão **Copiar** (fundo `#0E875C`, texto branco; vira
  "Copiado!" por 1.6s).
- Grid de 3 ações (`grid-template-columns:1fr 1fr 1fr; gap:10px`, altura 46px, radius 11px):
  - **Abrir** — preenchido `#16A36F` / hover `#0E875C` → `window.open(link)`.
  - **Compartilhar** — outline (`1.5px solid #CDE3D5`, texto `#0B6B4A`) → `navigator.share`,
    fallback copia.
  - **QR Code** — outline igual → abre o modal de QR.

### 3. History (cartão lateral, padding 24px)
- Cabeçalho: "Links recentes" (Space Grotesk 600, 16px) + botão "Limpar"
  (12.5px/600, `#9AA7A0`, hover `#D02B2B`) quando há itens.
- **Item** (lista, gap 9px, scroll máx. 440px): borda `1px solid #ECEFEA`, radius 13px,
  fundo `#FCFDFC`. Ícone de link em quadrado `34px` verde-claro `#EAF7EF`. Número em
  13.5px/700 `#1B2A23`; abaixo `short · tempo relativo` em 11.5px `#9AA7A0`.
  Botões copiar e excluir (30px, fundo `#F0F2EF`).
- **Estado vazio**: ícone em quadrado `54px` `#F2F6F1`, "Nenhum link ainda" (14px/600) +
  "Os links que você gerar aparecem aqui." (13px, `#9AA7A0`).

### 4. Modal QR Code
- Overlay `rgba(15,30,24,.5)` + `blur(4px)`, fecha ao clicar fora ou em Esc.
- Card 340px, radius 22px, padding 26px, animação `zzModal`. Cabeçalho com título +
  botão fechar. QR `240×240` em moldura branca (borda `#ECEFEA`, radius 18px).
  Número exibido abaixo. Botão **"Baixar PNG"** (mesmo gradiente do "Gerar link").

---

## Interactions & Behavior
- **Máscara BR**: dígitos formatados como `(DD) 9XXXX-XXXX` (11 díg.) ou `(DD) XXXX-XXXX` (10).
  Outros países: apenas dígitos (até 15), agrupados a cada 3.
- **Enter** no input dispara "Gerar link".
- **Validação**: BR exige ≥10 dígitos; outros ≥7. Abaixo disso → estado de erro.
- **Geração do link**: `https://wa.me/{dial}{digitos}`; se houver mensagem,
  `+ "?text=" + encodeURIComponent(msg)`.
- **Copiar**: `navigator.clipboard.writeText` (fallback `execCommand('copy')`); feedback
  "Copiado!" por 1.6s.
- **QR**: gerado com a lib **QRious** (`level:'M'`, fg `#0F1E18`, bg `#fff`, 240px).
  Download via `canvas.toDataURL('image/png')`.
- **Histórico**: persistido em `localStorage` na chave `zzlink_history` (máx. 20, sem
  duplicar mesmo link). Tempo relativo: "agora", "há N min", "há N h", "ontem", `dd/mm`.
- **Animações**: `zzPop` (entrada, 8px+scale), `zzFade` (opacidade), `zzModal` (14px+scale),
  todas com easing `cubic-bezier(.2,.8,.2,1)` ou `ease`.

## State Management
- `countryIdx`, `countryOpen` — país selecionado / dropdown aberto.
- `phoneDigits` (string só de dígitos), `message`, `showMessage`.
- `result` (`{link, e164, display}` ou null), `error` (string), `copied` (bool).
- `qrOpen` (bool), `history` (array de `{id, link, display, ts}`).

## Design Tokens

### Cores
| Uso | Hex |
|---|---|
| Texto principal (ink) | `#0F1E18` |
| Texto secundário | `#5C6B62` / `#3C4B43` |
| Texto suave / placeholder | `#9AA7A0` |
| Fundo da página | `#EEF1EC` |
| Glow topo | `#D8EFE2` |
| Superfície (cards) | `#FFFFFF` |
| Bordas | `#E6EAE4` / `#E1E7E0` / `#ECEFEA` |
| Esmeralda primária | `#0E875C` |
| Esmeralda escura | `#0B6B4A` |
| Esmeralda viva / gradiente | `#15A371` → `#0C7A52` ; `#13A06E` ; `#16A36F` |
| Tint de sucesso (fundo) | `#F0FAF4` / `#EAF7EF` ; borda `#CDEBDB` |
| Erro | `#D02B2B` ; tint `#FCE9E9` |

### Tipografia
- Display/títulos: **Space Grotesk** (500/600/700).
- Texto/UI: **Manrope** (400/500/600/700).
- Escala: H1 26px · H2 16px · corpo 15px · label 13px · meta 11.5–12px.

### Raios
`8px` (botões pequenos) · `9–13px` (controles) · `14px` (botão primário) ·
`18px` (cartão de resultado / moldura QR) · `22px` (cards e modal) · `999px` (chips).

### Sombras
- Card: `0 1px 2px rgba(16,30,24,.04), 0 18px 40px -28px rgba(16,30,24,.22)`.
- Botão primário: `0 10px 22px -10px rgba(12,122,82,.7)`.
- Dropdown: `0 18px 44px -16px rgba(16,30,24,.3)`.
- Modal: `0 30px 70px -20px rgba(0,0,0,.5)`.

### Espaçamento
Base de 4px. Padding de card 34px (generator) / 24px (history) / 26px (modal).
Gaps comuns: 9–14px (interno), 24px (entre cards).

## Assets
- **Fontes**: Google Fonts — Space Grotesk + Manrope.
- **QR**: lib QRious 4.0.2 (CDN). Substitua pela lib de QR do seu projeto se preferir.
- **Ícones**: SVGs inline (balão/link, copiar, lixeira, compartilhar, QR, +, x, alerta).
  Recrie com o seu set de ícones (ex.: Lucide/Heroicons) mantendo `stroke-width ~1.7–2`.
- **Bandeiras**: emojis de bandeira no seletor de país.

## Files
- `ZZLink-reference.html` — referência standalone (abre offline). **Não editar** (compilado).
- `source/ZZLink.dc.html` — fonte do protótipo (template + lógica) para consulta detalhada.
- `README.md` — esta especificação.
