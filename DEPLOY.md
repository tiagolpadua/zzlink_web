# Deploy no Cloudflare Pages

Roteiro para hospedar o ZZLink no Cloudflare Pages com deploy automático via GitHub.

---

## Pré-requisitos

- Conta no [Cloudflare](https://dash.cloudflare.com/) (gratuita)
- Repositório do projeto no GitHub
- Node.js ≥ 18 instalado localmente

---

## Parte 1 — Preparar o repositório

### 1.1 Garantir que o código está no GitHub

```bash
# Se ainda não tiver remote configurado:
git remote add origin https://github.com/<seu-usuario>/zzlink_web.git
git push -u origin main
```

### 1.2 Verificar o build local antes de subir

```bash
npm install
npm run build
```

O comando deve terminar sem erros e gerar a pasta `dist/` com os arquivos estáticos.

---

## Parte 2 — Criar o projeto no Cloudflare Pages

### 2.1 Acessar o dashboard

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com/)
2. No menu lateral, clique em **Workers & Pages**
3. Clique em **Create** → aba **Pages**

### 2.2 Conectar ao GitHub

1. Clique em **Connect to Git**
2. Autorize o Cloudflare a acessar sua conta GitHub (aparece uma tela de OAuth)
3. Selecione o repositório **zzlink_web**
4. Clique em **Begin setup**

### 2.3 Configurar o build

Na tela de configuração do projeto, preencha:

| Campo                                  | Valor                              |
|----------------------------------------|------------------------------------|
| **Project name**                       | `zzlink_web`                       |
| **Production branch**                  | `main`                             |
| **Build command**                      | `npm run build`                    |
| **Deploy command**                     | `npx wrangler pages deploy dist`   |
| **Builds for non-production branches** | ✅ marcado (preview URLs para PRs) |

> A nova interface do Cloudflare Pages usa Wrangler diretamente. O `dist` no deploy command é o `outDir` configurado em `vite.config.ts`. O `npm install` é executado automaticamente antes do build.
> O nome do projeto é lido automaticamente do `wrangler.toml` na raiz do repositório — não é necessário passar `--project-name` no comando.
> Se aparecer "Build output directory" em vez de "Deploy command" (interface antiga), preencha apenas `dist` nesse campo e deixe o deploy command em branco.

### 2.4 Variáveis de ambiente (opcional)

Não há variáveis de ambiente obrigatórias no ZZLink — a versão é lida do `package.json` em tempo de build. Se quiser adicionar no futuro:

1. Clique em **Environment variables (advanced)**
2. Adicione pares `NOME=valor`
3. Defina escopo: **Production**, **Preview** ou ambos

### 2.5 Iniciar o deploy

Clique em **Save and Deploy**.

O Cloudflare vai:
1. Clonar o repositório
2. Rodar `npm install && npm run build`
3. Publicar o conteúdo de `dist/` na CDN global

O primeiro deploy leva cerca de 1-2 minutos.

---

## Parte 3 — Acessar a URL gerada

Após o deploy, o projeto fica disponível em:

```
https://zzlink-web.pages.dev
```

> O subdomínio é baseado no **Project name** escolhido no passo 2.3.
> Se o nome já estiver em uso, o Cloudflare sugere uma alternativa.

---

## Parte 4 — Deploys automáticos

A partir de agora, qualquer `git push` para `main` dispara um novo deploy automaticamente:

```bash
# Fluxo normal de trabalho
git add .
git commit -m "feat: minha mudança"
git push origin main
# → Cloudflare Pages detecta o push e inicia o build em segundos
```

Pull Requests também geram **preview deployments** com URL única:
```
https://<hash>.zzlink-web.pages.dev
```

---

## Parte 5 — Domínio personalizado (opcional)

Para usar um domínio próprio (ex.: `zzlink.com.br`):

1. No dashboard do projeto, vá em **Custom domains** → **Set up a custom domain**
2. Digite seu domínio e clique em **Continue**
3. **Se o domínio já estiver no Cloudflare:** o registro DNS é criado automaticamente.
4. **Se o domínio estiver em outro registrador:** adicione um registro CNAME no painel do registrador:
   ```
   Tipo:  CNAME
   Nome:  @ (ou subdomínio, ex.: www)
   Valor: zzlink-web.pages.dev
   ```
5. Aguarde a propagação do DNS (pode levar até 24h, mas costuma ser minutos no Cloudflare).

O certificado TLS/SSL é emitido e renovado automaticamente.

---

## Parte 6 — Cache dos assets (headers)

O Vite já gera hashes nos nomes dos arquivos (`index-Cx9nLB5t.js`), o que permite cache agressivo.
Para configurar os headers de cache, crie o arquivo `public/_headers` na raiz do projeto:

```
# Cache longo para assets com hash no nome (imutáveis)
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Sem cache para index.html (sempre busca a versão mais recente)
/
  Cache-Control: no-cache
```

> A pasta `public/` é copiada para `dist/` pelo Vite sem transformação.
> O Cloudflare Pages lê `_headers` automaticamente.

---

## Resumo dos comandos

```bash
# Testar o build antes do deploy
npm run build
npm run preview   # serve dist/ em http://localhost:4173

# Deploy via git (automático após configuração)
git push origin main
```

---

## Referências

- [Documentação Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Deploy de projetos Vite no Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite3-project/)
- [Custom domains no Pages](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Arquivo `_headers`](https://developers.cloudflare.com/pages/configuration/headers/)
