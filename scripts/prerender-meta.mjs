// Pós-build: gera dist/<rota>/index.html com <head> específico por rota.
// Scrapers sociais (LinkedIn/WhatsApp/Facebook) não rodam JS — leem só o HTML
// estático. Este script injeta title/description/canonical/OG/Twitter por rota
// para que cada URL compartilhe corretamente. Usuários e Google recebem a SPA
// normal (o hook useSeo mantém o head consistente em runtime).
//
// Também injeta as dicas de carregamento que encurtam a cadeia até o LCP:
// `modulepreload` do chunk da rota (senão o browser só o descobre depois de
// executar index.js) e, na home, `preload` da imagem do hero.
//
// Sem dependências: puro Node (fs/path). Roda no build local e no Vercel.

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const SITE = 'https://victor-kaue.vercel.app';
const DEFAULT_IMAGE = `${SITE}/images/fotos-projetos-pessoais/vk-portifolio/victor_kaue.webp`;

// Imagem LCP da home. Deve espelhar o <img className="hero-image"> em
// src/pages/Home/Home.tsx — se um mudar, o outro muda junto.
const HERO_LCP = {
  href: '/images/eu/victorkaue-450.webp',
  srcset:
    '/images/eu/victorkaue-280.webp 280w, /images/eu/victorkaue-450.webp 450w, /images/eu/victorkaue-560.webp 560w, /images/eu/victorkaue-900.webp 900w',
  sizes: '(max-width: 480px) 65vw, (max-width: 768px) 70vw, 450px',
};

// Espelha src/i18n.ts (seo.*, PT — idioma padrão indexado).
// `entry` = chave no dist/.vite/manifest.json (rota lazy em src/App.tsx).
const routes = [
  {
    path: '/',
    entry: 'src/pages/Home/Home.tsx',
    heroPreload: HERO_LCP,
    title: 'Victor Kauê | Desenvolvedor Full Stack',
    description:
      'Portfólio de Victor Kauê — desenvolvedor backend/full-stack com foco em Python, Django, APIs escaláveis e sistemas web modernos, da ideia ao deploy.',
  },
  {
    path: '/sobre',
    entry: 'src/pages/Sobre/Sobre.tsx',
    title: 'Sobre — Victor Kauê',
    description:
      'Conheça Victor Kauê: desenvolvedor backend/full-stack — trajetória técnica, experiência profissional, formação e stack de tecnologias.',
  },
  {
    path: '/projetos',
    entry: 'src/pages/Projetos/Projetos.tsx',
    title: 'Projetos — Victor Kauê',
    description:
      'Projetos selecionados de Victor Kauê: sistemas web, APIs REST, dashboards e aplicações feitas com Python, Django, React e TypeScript.',
  },
  {
    path: '/servicos',
    entry: 'src/pages/Servicos/Servicos.tsx',
    title: 'Serviços — Victor Kauê',
    description:
      'Serviços de Victor Kauê: sistemas customizados, desenvolvimento web, APIs REST e consultoria tech — robustos, escaláveis e de alta performance.',
  },
  {
    path: '/certificados',
    entry: 'src/pages/Certificados/Certificados.tsx',
    title: 'Certificados — Victor Kauê',
    description:
      'Certificações e cursos concluídos por Victor Kauê em backend, frontend e engenharia de software.',
  },
  {
    path: '/contato',
    entry: 'src/pages/Contato/Contato.tsx',
    title: 'Contato — Victor Kauê',
    description:
      'Vamos conversar sobre seu projeto. Fale com Victor Kauê e transforme sua ideia em um produto digital robusto e escalável.',
  },
];

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Substitui o content de uma <meta name|property="key">. */
function setMetaContent(html, attr, key, value) {
  const re = new RegExp(`(<meta ${attr}="${key}"[^>]*content=")[^"]*(")`, 'i');
  if (re.test(html)) return html.replace(re, `$1${escapeHtml(value)}$2`);
  // Não existe no index.html base — injeta antes de </head>.
  const tag = `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`;
  return html.replace('</head>', `    ${tag}\n</head>`);
}

/** Lê dist/.vite/manifest.json (build.manifest em vite.config.ts). */
function loadManifest() {
  const manifestPath = join(DIST, '.vite', 'manifest.json');
  if (!existsSync(manifestPath)) {
    console.warn(
      '[prerender-meta] dist/.vite/manifest.json ausente — modulepreload não será injetado.'
    );
    return null;
  }
  try {
    return JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch (err) {
    console.warn(`[prerender-meta] manifest ilegível (${err.message}) — seguindo sem preload.`);
    return null;
  }
}

/**
 * Links de pré-carregamento do chunk da rota: o próprio chunk e os que ele
 * importa estaticamente (modulepreload) + o CSS da rota (preload as=style).
 * Sem isso o browser só descobre esses arquivos depois de executar index.js.
 */
function routePreloadLinks(manifest, entry) {
  if (!manifest || !entry) return [];

  const seen = new Set();
  const scripts = [];
  const styles = new Set();

  const visit = (key) => {
    if (seen.has(key)) return;
    seen.add(key);
    const chunk = manifest[key];
    if (!chunk) return;
    if (chunk.file) scripts.push(chunk.file);
    for (const css of chunk.css ?? []) styles.add(css);
    for (const dep of chunk.imports ?? []) visit(dep);
  };
  visit(entry);

  if (scripts.length === 0) {
    console.warn(`[prerender-meta] entry "${entry}" não encontrado no manifest.`);
    return [];
  }

  return [
    ...scripts.map((file) => `<link rel="modulepreload" crossorigin href="/${file}" />`),
    ...[...styles].map((file) => `<link rel="preload" as="style" href="/${file}" />`),
  ];
}

/** Preload da imagem do LCP — só faz sentido na rota que a renderiza. */
function heroPreloadLink(hero) {
  if (!hero) return [];
  return [
    `<link rel="preload" as="image" href="${hero.href}" imagesrcset="${escapeHtml(hero.srcset)}" imagesizes="${escapeHtml(hero.sizes)}" fetchpriority="high" />`,
  ];
}

// O script usa dist/index.html como base e também o reescreve. Os links ficam
// entre sentinelas para poderem ser removidos antes de reinjetar — assim rodar
// `npm run prerender` duas vezes não acumula tags.
const LINKS_START = '<!-- prerender-meta:links -->';
const LINKS_END = '<!-- /prerender-meta:links -->';
const LINKS_BLOCK_RE = new RegExp(`\\s*${LINKS_START}[\\s\\S]*?${LINKS_END}`, 'g');

function stripInjectedLinks(html) {
  return html.replace(LINKS_BLOCK_RE, '');
}

function injectHeadLinks(html, links) {
  // O Vite já emite <script> e modulepreload dos chunks do entry — não repetir.
  const novos = links.filter((link) => {
    const href = link.match(/href="([^"]+)"/)?.[1];
    return href ? !html.includes(`"${href}"`) : true;
  });
  if (novos.length === 0) return html;
  const bloco = [LINKS_START, ...novos, LINKS_END].join('\n    ');
  return html.replace('</head>', `    ${bloco}\n</head>`);
}

function applyMeta(html, { path, title, description, entry, heroPreload }, manifest) {
  const url = `${SITE}${path === '/' ? '/' : path}`;
  let out = stripInjectedLinks(html);

  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  out = setMetaContent(out, 'name', 'description', description);
  out = out.replace(/(<link rel="canonical"[^>]*href=")[^"]*(")/i, `$1${url}$2`);

  out = setMetaContent(out, 'property', 'og:title', title);
  out = setMetaContent(out, 'property', 'og:description', description);
  out = setMetaContent(out, 'property', 'og:url', url);
  out = setMetaContent(out, 'property', 'og:image', DEFAULT_IMAGE);

  out = setMetaContent(out, 'name', 'twitter:title', title);
  out = setMetaContent(out, 'name', 'twitter:description', description);
  out = setMetaContent(out, 'name', 'twitter:url', url);
  out = setMetaContent(out, 'name', 'twitter:image', DEFAULT_IMAGE);

  out = injectHeadLinks(out, [
    ...heroPreloadLink(heroPreload),
    ...routePreloadLinks(manifest, entry),
  ]);

  return out;
}

function run() {
  const indexPath = join(DIST, 'index.html');
  let base;
  try {
    base = readFileSync(indexPath, 'utf8');
  } catch {
    console.error('[prerender-meta] dist/index.html não encontrado — rode o build antes.');
    process.exit(1);
  }

  const manifest = loadManifest();

  for (const route of routes) {
    const html = applyMeta(base, route, manifest);
    const outPath =
      route.path === '/' ? indexPath : join(DIST, route.path.replace(/^\//, ''), 'index.html');
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html, 'utf8');
    console.log(`[prerender-meta] ${route.path} → ${outPath.replace(DIST, 'dist')}`);
  }

  console.log(`[prerender-meta] ${routes.length} rotas geradas.`);
}

run();
