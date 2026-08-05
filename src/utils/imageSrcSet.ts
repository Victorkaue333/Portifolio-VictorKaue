// Monta `srcset` a partir das variantes geradas por `npm run images:optimize`.
//
// O script grava src/data/image-variants.json com as larguras que realmente
// existem em disco (ele descarta variantes que ficariam maiores que o original),
// então nunca apontamos para um arquivo inexistente.

import variantsJson from '../data/image-variants.json';

const VARIANTS = variantsJson as Record<string, number[]>;

/** Caminho da variante: `/a/b.webp` + 480 → `/a/b-480.webp`. */
function variantPath(src: string, width: number): string {
  return `${src.replace(/\.webp$/i, '')}-${width}.webp`;
}

/**
 * `srcset` com descritores `w` para a imagem, ou `undefined` quando não há
 * variantes (o `src` original continua sendo servido).
 */
export function srcSetFor(src: string): string | undefined {
  const widths = VARIANTS[src];
  if (!widths || widths.length === 0) return undefined;
  return widths.map((w) => `${variantPath(src, w)} ${w}w`).join(', ');
}

/**
 * Melhor `src` de fallback: a maior variante disponível até `maxWidth`.
 * Browsers sem suporte a `srcset` (e o preload scanner) usam este valor.
 */
export function srcFor(src: string, maxWidth: number): string {
  const widths = VARIANTS[src];
  if (!widths || widths.length === 0) return src;
  const candidates = widths.filter((w) => w <= maxWidth);
  const chosen = candidates.length > 0 ? Math.max(...candidates) : Math.min(...widths);
  return variantPath(src, chosen);
}
