import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './NavigationLoader.css';

/**
 * Barrinha de progresso no topo a cada troca de rota.
 *
 * Era `AnimatePresence` + `motion.div`, o que puxava o framer-motion para o
 * bundle inicial por causa de um fade de 160 ms. Agora o elemento fica sempre
 * montado e só troca de classe — o fade de saída é uma transição de opacity.
 */
export function NavigationLoader() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const isFirst = useRef(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    if (hideTimer.current) clearTimeout(hideTimer.current);

    setVisible(true);
    hideTimer.current = setTimeout(() => setVisible(false), 420);

    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [location.key]);

  return (
    <div
      // A chave remonta o elemento a cada navegação para o sweep do ::before
      // recomeçar do zero (senão a animação só toca na primeira troca).
      key={location.key}
      className={`nav-progress${visible ? ' is-visible' : ''}`}
      aria-hidden="true"
    />
  );
}
