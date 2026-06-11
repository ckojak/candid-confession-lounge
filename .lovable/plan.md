
# MVP Kojak — Rede social híbrida de desabafos

Aplicação React + TanStack Start (já configurado), Tailwind v4 e Lucide Icons. Tudo mockado no frontend (estado em React, sem backend). Tema dark acolhedor: azul escuro, cinza espacial, acentos roxo neon suave.

## Identidade visual

- Tokens novos em `src/styles.css` (dark como padrão aplicando `.dark` no `<html>`):
  - `--background` azul-escuro quase preto, `--card` cinza-espacial, `--primary` roxo neon suave, `--accent` roxo translúcido, `--destructive` vermelho discreto.
  - Glow sutil em botões primários via `--shadow-glow`.
- Tipografia: display "Space Grotesk" + body "Inter" via `<link>` no `__root.tsx` e `--font-*` no `@theme`.
- Logo temporária: wordmark "kojak." com ponto roxo (componente, sem imagem).

## Rotas (TanStack Start)

```
src/routes/
  __root.tsx          → shell + fontes + provider de sessão mock
  index.tsx           → Landing + login/cadastro inline
  _app.tsx            → layout autenticado (header + outlet); redireciona p/ "/" se não logado
  _app.feed.tsx       → Feed principal (abas Geral / Minha Mente)
  _app.verificar.tsx  → Tela de verificação de identidade (KYC mock)
  _app.perfil.tsx     → Perfil simples do usuário atual
```

Sessão mockada via Context + `localStorage` (`kojak.session`, `kojak.users`, `kojak.posts`). Sem Lovable Cloud.

## Telas e componentes

### 1. Landing (`/`)
- Header: `<Logo />` + botões "Entrar" / "Criar conta" (rolam até o form).
- Hero: headline "Fale o que sente. Com sua identidade ou no anonimato total." + sub + CTAs.
- Seção "Como funciona": 3 cards (Identidade ou Anônimo, Verificação opcional, Comunidade segura) com ícones Lucide (`ShieldCheck`, `VenetianMask`, `Users`).
- Bloco lado-a-lado com `<AuthTabs />` (tabs Entrar / Cadastrar) — formulários completos abaixo.

### 2. Cadastro + KYC mock
- `RegisterForm`: Nome, E-mail, Senha, Data de nascimento.
  - Validação com Zod: idade ≥ 16 (calcular a partir da data), e-mail válido, senha ≥ 8.
  - Mensagens de erro inline em vermelho.
- Após cadastro → loga e vai para `/feed`.
- `/verificar`: card explicativo + `<input type="file">` mock; ao "enviar", marca `verified: true` no usuário e mostra `ShieldCheck` roxo + toast. Botão para pular.

### 3. Feed (`/feed`)
- Header autenticado: logo, link "Verificar identidade" (se não verificado), avatar + menu (sair).
- `Tabs`: "Feed Geral" | "Minha Mente" (apenas posts do usuário logado, inclusive os anônimos dele).
- `ComposePost`:
  - `Textarea` "O que você está sentindo?" (limite 500 chars com contador).
  - `MoodPicker`: chips com ícone+label — Feliz (`Smile`), Triste (`Frown`), Pensativo (`Brain`), Ansioso (`Wind`). Cor do chip muda quando selecionado.
  - **Toggle destacado** `IdentitySwitch`: dois estados visuais grandes — esquerda "Postar como {nome}" (avatar real), direita "Postar Anonimamente" (ícone `VenetianMask`). Estado ativo com borda/halo roxo.
  - Botão "Publicar" desativado se vazio, se humor não escolhido, ou se filtro de palavras detectar termo.
  - **Filtro de palavras ofensivas**: lista em `src/lib/profanity.ts` (~15 termos PT-BR comuns). Ao digitar, regex case-insensitive; se houver match, banner vermelho `AlertTriangle` "Sua mensagem contém termos que violam nossas diretrizes. Reformule para publicar." e bloqueia envio.
- `PostCard`:
  - Header: avatar + nome + badge `ShieldCheck` se verificado; se `anonymous`, avatar cinza padrão (`UserCircle`) e nome "Anônimo" — badge oculto independentemente.
  - Chip de humor com ícone/cor.
  - Texto do desabafo.
  - Timestamp relativo ("há 3 min") com util próprio.
  - Footer: `Heart` (curtir, alterna estado e contador), `MessageCircle` (abre/fecha thread de comentários), `Flag` vermelho discreto (abre modal de denúncia).
- `Comments` (thread pública sob o post):
  - Lista de comentários com mesma lógica de identidade (autor real ou Anônimo).
  - Input para novo comentário + mesmo filtro de palavras + mesmo toggle anônimo.
- `ReportModal` (`Dialog` shadcn):
  - Radios: "Abuso ou assédio", "Discurso de ódio", "Ofensas / linguagem imprópria", "Conteúdo sensível sem aviso", "Outro".
  - Campo opcional de detalhes.
  - Botão "Enviar denúncia" → toast "Denúncia recebida. Nossa equipe vai revisar." + marca o post como `reportedByMe` (apenas UI local).

### 4. Regras gerais de segurança/UX
- Sem rota nem componente de chat privado/DM. Header não tem ícone de mensagens. Documentar em comentário no header.
- Toda interação fica nos comentários públicos do post.
- Posts seed (3-4) com mistura de público/anônimo, verificado/não, humores variados, para o feed nunca aparecer vazio.

## Estrutura de arquivos a criar

```
src/
  components/
    Logo.tsx
    auth/AuthTabs.tsx
    auth/LoginForm.tsx
    auth/RegisterForm.tsx
    layout/AppHeader.tsx
    feed/ComposePost.tsx
    feed/MoodPicker.tsx
    feed/IdentitySwitch.tsx
    feed/PostCard.tsx
    feed/Comments.tsx
    feed/ReportModal.tsx
    common/VerifiedBadge.tsx
    common/MoodChip.tsx
  context/SessionContext.tsx
  context/PostsContext.tsx
  lib/profanity.ts
  lib/mood.ts            (config: id, label, icon, color)
  lib/time.ts            (formato relativo)
  lib/validation.ts      (schemas Zod)
  routes/_app.tsx
  routes/_app.feed.tsx
  routes/_app.verificar.tsx
  routes/_app.perfil.tsx
```

Reaproveita shadcn existente: `button`, `input`, `textarea`, `tabs`, `dialog`, `radio-group`, `switch`, `avatar`, `badge`, `card`, `sonner` (toasts).

## Detalhes técnicos

- Dark mode forçado: adicionar `className="dark"` em `<html>` no `RootShell`.
- Persistência: tudo via `localStorage` num pequeno wrapper (SSR-safe: ler dentro de `useEffect`).
- Responsivo mobile-first (viewport 390 confirmado): grid de uma coluna no feed, header colapsa para logo + avatar, modais em sheet/dialog responsivo.
- Acessibilidade: labels em todos os inputs, `aria-pressed` no toggle de identidade, foco visível.
- SEO básico por rota (`head()` com title/description distintos para `/`, `/feed`, `/verificar`).

## Fora do escopo (explícito)

- Backend, persistência real, autenticação real, moderação por IA, notificações, DMs, upload real de documento, denúncia real.
