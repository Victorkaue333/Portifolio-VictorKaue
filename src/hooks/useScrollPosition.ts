import { useState, useEffect } from 'react';

/**
 * Diz apenas se a página passou do `threshold`. Só isso — expor o `scrollY`
 * cru fazia o componente que usa o hook re-renderizar a cada quadro de rolagem
 * (a Navbar redesenhava 12 ícones por quadro). Com um booleano, o React
 * descarta o `setState` quando o valor não muda e o re-render some.
 */
export function useScrollPosition(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > threshold);
        ticking = false;
      });
    };

    handleScroll(); // estado inicial (recarregar já rolado / voltar no histórico)
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return { scrolled };
}
