# DECISIONS

Registro de decisões técnicas (ADRs). Decisões são **acrescentadas, não
apagadas** — o histórico é a memória do projeto. Mais recente no topo.

Formato de cada entrada: data · contexto · decisão · alternativas · consequências.

---

## ADR-0007 — Variantes de imagem geradas por `sharp` e commitadas

- **Data:** 2026-07-23
- **Contexto:** O PageSpeed (mobile) apontava **341 KiB** desperdiçados servindo
  originais em elementos muito menores — o pior caso era `images/eu/victor.webp`
  (193,7 KiB, 1080×1920) usado como avatar 28×28 em cada `ProjectCard`. O hero
  (elemento LCP) também só era descoberto depois de `index.js` → `Home.js`.
- **Decisão:** Adicionar `sharp` como **devDependency** e o script
  `scripts/optimize-images.mjs` (`npm run images:optimize`), que gera
  `<nome>-<largura>.webp` ao lado do original e grava
  `src/data/image-variants.json`. As variantes são **commitadas**; o build da
  Vercel não roda o script. `src/utils/imageSrcSet.ts` monta o `srcset` a partir
  do manifesto — nunca aponta para variante inexistente (o script descarta
  variantes que ficariam maiores que o original). O `prerender-meta.mjs` passou
  a injetar `preload` do hero (só em `/`) e `modulepreload` do chunk da rota,
  lendo `dist/.vite/manifest.json`.
- **Alternativas consideradas:** Vercel Image Optimization (`/_vercel/image`) —
  sem dependência nova, mas consome cota e não funciona em `dev`;
  `vite-imagetools`; redimensionar manualmente.
- **Consequências:** Repositório carrega ~470 KiB de variantes versionadas e é
  preciso rodar `npm run images:optimize` ao adicionar/trocar uma capa de
  projeto (senão ela é servida em tamanho original). Em troca: sem dependência
  em runtime, sem custo de build na Vercel e o mesmo enquadramento do
  `object-fit: cover` (crop `centre`).

## ADR-0006 — Conteúdo de `src/data/` em PT-BR fixo (i18n cobre só a UI)

- **Data:** 2026-07-12
- **Contexto:** O i18next traduz a UI (navegação, heros, formulários), mas o
  conteúdo em `src/data/` (experiências, expertise, descrições de projetos) é
  texto PT-BR hard-coded. Ao trocar para EN, esse conteúdo permanece em PT.
- **Decisão:** Manter o conteúdo de dados apenas em PT-BR. O público-alvo do
  portfólio é brasileiro; duplicar todo o conteúdo em EN custaria manutenção
  contínua sem retorno claro.
- **Alternativas consideradas:** campos `{ pt, en }` nos tipos de dados;
  arquivos de dados por idioma; mover conteúdo para chaves i18n.
- **Consequências:** Página em EN fica híbrida (chrome em EN, conteúdo em PT).
  Se o público internacional crescer, migrar os tipos de dados para campos
  bilíngues é o caminho.

## ADR-0005 — Canvas 2D + react-icons no lugar de three.js/R3F e devicon

- **Data:** 2026-07-12 (registro; decisão vigente no código)
- **Contexto:** O background 3D do Hero (three/@react-three/fiber/drei) pesava
  ~1 MB de bundle WebGL, e o font-icon devicon somava ~1,5 MB para exibir
  ícones de tecnologia.
- **Decisão:** Reescrever o background como Canvas 2D
  (`components/ui/FloatingLines`) com o mesmo visual, e resolver ícones de
  tecnologia por nome via react-icons (Simple Icons/Feather) no mapa
  `TECH_ICONS` (`components/ui/TechIcon`). Dependências three/R3F, devicon e
  lucide-react removidas do `package.json`.
- **Alternativas consideradas:** manter WebGL com lazy-load; sprite SVG próprio;
  CDN devicon (dependência externa em runtime).
- **Consequências:** ~2,5 MB a menos de bundle e zero CDN em runtime; novas
  tecnologias exigem registrar o ícone no mapa `TECH_ICONS`. Atualiza o stack
  descrito no ADR-0001.

## ADR-0004 — Contato via deep-link de WhatsApp (sem e-mail server-side)

- **Data:** 2026-07-11 (registro; decisão vigente no código)
- **Contexto:** O formulário de contato precisa entregar mensagens sem manter
  backend, servidor de e-mail ou proteção anti-spam.
- **Decisão:** Ao enviar, montar uma URL `wa.me` com os campos pré-formatados e
  abrir o WhatsApp em nova aba (`src/pages/Contato/Contato.tsx`).
- **Alternativas consideradas:** serviço de e-mail (EmailJS/Formspree);
  função serverless de envio; `mailto:`.
- **Consequências:** Zero backend e canal direto/imediato; porém depende de o
  usuário ter WhatsApp e não gera registro server-side das mensagens.

## ADR-0003 — Conteúdo como código TypeScript (sem CMS/banco)

- **Data:** 2026-07-11 (registro; decisão vigente no código)
- **Contexto:** Projetos, experiências e certificados precisam ser exibidos e
  atualizados com segurança de tipos.
- **Decisão:** Modelar o conteúdo como módulos `.ts` tipados em `src/data/`,
  agregados/normalizados em build (ver `projects.ts`).
- **Alternativas consideradas:** CMS headless (Contentful/Sanity); banco +
  API; arquivos Markdown/JSON.
- **Consequências:** Type-safety, histórico via git e deploy trivial; em troca,
  editar conteúdo exige alterar código e refazer o build (sem edição em runtime).

## ADR-0002 — Manter arquivos `.env`/`.env.example` do AIOX apenas documentados

- **Data:** 2026-07-11
- **Contexto:** A raiz contém `.env` e `.env.example` do instalador "Synkra
  AIOX" (chaves de LLM, Supabase, etc.) que **não são usados** pelo app. O
  `.env.example` versionado é enganoso.
- **Decisão:** Documentar a discrepância em [ENVIRONMENT.md](ENVIRONMENT.md) e
  **não** remover/reescrever os arquivos sem confirmação do autor, por serem
  tooling externo.
- **Alternativas consideradas:** apagar ambos; reescrever `.env.example` já.
- **Consequências:** Nenhum risco de quebrar tooling externo; pendência aberta
  para limpar o `.env.example` quando confirmado.

## ADR-0001 — Stack front-end: React 19 + TypeScript + Vite, SPA estática

- **Data:** 2026-07-11 (registro; decisão vigente no código)
- **Contexto:** Portfólio precisa de UI premium/animada, bilíngue e de fácil
  hospedagem, servindo também como prova de competência técnica.
- **Decisão:** SPA com React 19, TypeScript strict, Vite 6, react-router-dom 7,
  Tailwind 4, framer-motion, three/@react-three/fiber e i18next; deploy estático
  na Vercel.
- **Alternativas consideradas:** Next.js (SSR/SSG); Astro; site estático simples.
- **Consequências:** Navegação fluida e DX moderna; SEO limitado a meta tags
  estáticas (sem SSR) e conteúdo dependente de rebuild para atualizar.

---

## Como adicionar uma decisão

Copie o bloco abaixo no topo da lista, incremente o número e preencha:

```
## ADR-XXXX — <título curto>
- **Data:** AAAA-MM-DD
- **Contexto:** <por que a decisão foi necessária>
- **Decisão:** <o que foi decidido>
- **Alternativas consideradas:** <opções descartadas>
- **Consequências:** <trade-offs, impactos, dívidas>
```
