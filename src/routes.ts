import { lazy } from 'react';

/**
 * Um lugar só para os carregadores de rota, para que `lazy()` e o prefetch
 * apontem para o mesmo `import()` — e, portanto, para o mesmo chunk.
 *
 * Sem prefetch, clicar num link começava a baixar o chunk da página só depois
 * do clique: o usuário via o spinner enquanto a rede trabalhava. Chamar o
 * mesmo `import()` no hover/foco antecipa isso; a segunda chamada resolve
 * pela cache de módulos, então repetir é de graça.
 */
const loaders = {
  '/': () => import('./pages/Home/Home'),
  '/sobre': () => import('./pages/Sobre/Sobre'),
  '/projetos': () => import('./pages/Projetos/Projetos'),
  '/servicos': () => import('./pages/Servicos/Servicos'),
  '/certificados': () => import('./pages/Certificados/Certificados'),
  '/contato': () => import('./pages/Contato/Contato'),
} as const;

export const Home = lazy(loaders['/']);
export const Sobre = lazy(loaders['/sobre']);
export const Projetos = lazy(loaders['/projetos']);
export const Servicos = lazy(loaders['/servicos']);
export const Certificados = lazy(loaders['/certificados']);
export const Contato = lazy(loaders['/contato']);

export const ProjetoDetalhe = lazy(() => import('./pages/ProjetoDetalhe/ProjetoDetalhe'));
export const NaoEncontrado = lazy(() => import('./pages/NaoEncontrado/NaoEncontrado'));

/** Baixa o chunk da rota antes do clique. Erro de rede é ignorado de propósito:
 *  é só uma antecipação — a navegação de verdade tenta de novo e aí sim mostra
 *  o loader. */
export function prefetchRoute(path: string): void {
  const segment = path === '/' ? '/' : `/${path.split('/')[1]}`;
  const load = loaders[segment as keyof typeof loaders];
  if (load) void load().catch(() => {});
}
