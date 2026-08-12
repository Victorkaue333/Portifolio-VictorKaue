// Pós-build: gera dist/<rota>/index.html com <head> específico por rota.
// Scrapers sociais (LinkedIn/WhatsApp/Facebook) não rodam JS — leem só o HTML
// estático. Este script injeta title/description/canonical/OG/Twitter por rota
// para que cada URL compartilhe corretamente. Usuários e Google recebem a SPA
// normal (o hook useSeo mantém o head consistente em runtime).
//
// Sem dependências: puro Node (fs/path). Roda no build local e no Vercel.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const SITE = 'https://victor-kaue.vercel.app';
const DEFAULT_IMAGE = `${SITE}/images/fotos-projetos-pessoais/vk-portifolio/victor_kaue.webp`;

// Espelha src/i18n.ts (seo.*, PT — idioma padrão indexado).
const routes = [
  {
    path: '/',
    title: 'Victor Kauê | Desenvolvedor Full Stack',
    description:
      'Portfólio de Victor Kauê — desenvolvedor backend/full-stack com foco em Python, Django, APIs escaláveis e sistemas web modernos, da ideia ao deploy.',
  },
  {
    path: '/sobre',
    title: 'Sobre — Victor Kauê',
    description:
      'Conheça Victor Kauê: desenvolvedor backend/full-stack — trajetória técnica, experiência profissional, formação e stack de tecnologias.',
  },
  {
    path: '/projetos',
    title: 'Projetos — Victor Kauê',
    description:
      'Projetos selecionados de Victor Kauê: sistemas web, APIs REST, dashboards e aplicações feitas com Python, Django, React e TypeScript.',
  },
  {
    path: '/servicos',
    title: 'Serviços — Victor Kauê',
    description:
      'Serviços de Victor Kauê: sistemas customizados, desenvolvimento web, APIs REST e consultoria tech — robustos, escaláveis e de alta performance.',
  },
  {
    path: '/certificados',
    title: 'Certificados — Victor Kauê',
    description:
      'Certificações e cursos concluídos por Victor Kauê em backend, frontend e engenharia de software.',
  },
  {
    path: '/contato',
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

/** Preload da imagem LCP: só faz sentido na Home; nas outras rotas é download morto. */
function stripHomePreload(html) {
  return html.replace(/[ \t]*<!-- preload:home -->[\s\S]*?<!-- \/preload:home -->\n?/, '');
}

function applyMeta(html, { path, title, description }) {
  const url = `${SITE}${path === '/' ? '/' : path}`;
  let out = path === '/' ? html : stripHomePreload(html);

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

  for (const route of routes) {
    const html = applyMeta(base, route);
    const outPath =
      route.path === '/' ? indexPath : join(DIST, route.path.replace(/^\//, ''), 'index.html');
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html, 'utf8');
    console.log(`[prerender-meta] ${route.path} → ${outPath.replace(DIST, 'dist')}`);
  }

  console.log(`[prerender-meta] ${routes.length} rotas geradas.`);
}

run();
