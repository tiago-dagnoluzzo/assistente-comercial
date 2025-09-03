# Consultor de Automóveis — Site + IA via proxies públicos

Este pacote contém:
- `index.html` — UI completa (chat, CRM, analytics, trainer, personalização) com persona de **consultor de automóveis**.
- `api/chat_gemini.js` — função serverless (Vercel) que chama **Gemini** (Google AI Studio, free tier).
- `api/chat_mistral.js` — função serverless que chama **Mistral** (free limitado).
- `consultor-auto-config.json` — preset para importar em **Treinar scripts**.

## Como publicar no GitHub
1. Crie um repositório novo (público ou privado) em github.com.
2. Faça upload destes arquivos mantendo a estrutura:
   ```
   /index.html
   /api/chat_gemini.js
   /api/chat_mistral.js
   /consultor-auto-config.json
   ```
3. Commit e push.

## Como publicar no Vercel (backend + frontend no mesmo projeto)
1. No Vercel, clique **Add New… → Project → Import Git Repository** e selecione o repositório.
2. Em **Settings → Environment Variables**, adicione:
   - `GEMINI_API_KEY` (pegue no Google AI Studio).
   - `MISTRAL_API_KEY` (pegue no console da Mistral).  
3. Deploy. Após o deploy você terá:
   - Frontend: `https://SEU-PROJ.vercel.app` (servirá o `index.html`).
   - Endpoints:  
     - `https://SEU-PROJ.vercel.app/api/chat_gemini`  
     - `https://SEU-PROJ.vercel.app/api/chat_mistral`

> Dica: Vercel detecta `index.html` na raiz e hospeda como **Static Site** automaticamente, e cria **Serverless Functions** para arquivos em `/api`.

## Como configurar no site (após deploy)
1. Abra `https://SEU-PROJ.vercel.app`.
2. Aba **Demo (Chat)** → selecione **provedor** (Gemini/Mistral).
3. Em **URL base**, cole `https://SEU-PROJ.vercel.app` (sem `/api`).
4. Clique **Testar endpoint** (deve retornar Status: 200).
5. Ative **Usar IA (proxy público)** e converse.

## Importar o preset de persona
- Aba **Treinar scripts** → **Importar configuração** → selecione `consultor-auto-config.json`.

## Erros comuns
- **401/403**: variável de ambiente ausente/errada no Vercel.
- **429**: limite do free tier alcançado.
- **4xx "model not found"**: troque o modelo no proxy (`mdl`), p.ex. `gemini-1.5-flash-latest` ou `mistral-small-latest`.
- **502**: veja **Deploy → Logs** no Vercel (o proxy devolve `raw` do provedor).

Bom uso! 🚗💡
