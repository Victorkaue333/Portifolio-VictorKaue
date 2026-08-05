# CLAUDE.md

Regras para IA atuar neste repositório. Objetivo, conciso.

## Identidade do projeto

Portfólio pessoal de **Victor Kauê** — SPA front-end, sem backend. Conteúdo
(projetos, experiências, certificados) vive como dados TypeScript em
`src/data/`. Idioma do produto: PT-BR (com EN via i18n). Idioma dos docs: PT-BR.

## Stack

- React 19 + TypeScript (strict) + Vite 6
- Roteamento: react-router-dom 7 (`BrowserRouter`, SPA)
- Estilo: Tailwind CSS 4 + CSS por componente + design tokens em `src/styles/variables.css`
- Animação: framer-motion (transições de página e reveals); background do Hero é Canvas 2D (`FloatingLines`) — three.js/R3F foi removido
- Tema claro/escuro: `src/theme/ThemeProvider.tsx` (persistido em `localStorage`)
- i18n: i18next + react-i18next (PT/EN), detecção via `localStorage` (`portfolio-lang`)
- Ícones: react-icons (Simple Icons + Feather), resolvidos por nome em `src/components/ui/TechIcon/TechIcon.tsx` (`TECH_ICONS`); devicon foi removido
- Deploy: Vercel

## Estrutura

```
src/
  components/   Layout/ e ui/ (um componente por pasta, .tsx + .css)
  pages/        uma pasta por rota (Home, Sobre, Projetos, ...)
  data/         conteúdo tipado (projects/, experiences, certificates, ...)
  hooks/        hooks reutilizáveis
  styles/       variables, reset, global, animations
  types/        interfaces compartilhadas (index.ts)
scripts/        utilitários Node (enrich-projects.mjs)
docs/           documentação do projeto
```

## Comandos essenciais

- `npm run dev` — dev server em `http://localhost:3000`
- `npm run build` — checagem de tipos (`tsc -b`) + build Vite
- `npm run preview` — serve o build de produção
- `npm run projects:enrich` — busca READMEs dos repos e gera `src/data/projects.enrichment.json`
- `npm run images:optimize` — gera variantes responsivas `.webp` + `src/data/image-variants.json` (rodar ao adicionar/trocar capa de projeto; commitar o resultado)

Não há suíte de testes automatizados. "Testar" = `npm run build` passar sem
erro de tipo + validação visual manual (`dev`/`preview`).

## Convenções

- Componentes: PascalCase, uma pasta por componente com `.tsx` + `.css` de mesmo nome.
- Import alias: `@/` → `src/` (ver `vite.config.ts` e `tsconfig`). Prefira caminhos relativos existentes ao editar arquivos que já os usam.
- Novos projetos do portfólio: criar arquivo em `src/data/projects/{pessoais|profissionais}/` e registrar em `src/data/projects.ts`. Seguir a interface `Project` em `src/types/index.ts`.
- Textos visíveis: PT como padrão; adicionar chave EN correspondente em `src/i18n.ts` quando o texto passar pelo `t()`.
- Imagens: `.webp` em `public/images/...`, referenciadas por caminho absoluto (`/images/...`).
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, ...).

## Guardrails — a IA NUNCA deve

- Adicionar backend, banco de dados ou dependência pesada sem pedido explícito. Este é um projeto front-end estático.
- Commitar segredos. `.env` está no `.gitignore`; o app não usa variáveis de ambiente em runtime.
- Rodar `git push`, `git commit` ou abrir PR sem solicitação explícita do usuário.
- Rodar comandos destrutivos (`git reset --hard`, `rm -rf`, force push) sem confirmação.
- Substituir CSS/tokens globais em massa por causa de um ajuste local.
- Introduzir texto hard-coded onde já existe chave i18n.
- Alterar a interface `Project` sem atualizar todos os arquivos de dados que a consomem.

## Referências

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/DATABASE.md](docs/DATABASE.md) · [docs/DEPLOY.md](docs/DEPLOY.md)
- [docs/DECISIONS.md](docs/DECISIONS.md) — histórico de decisões técnicas.
