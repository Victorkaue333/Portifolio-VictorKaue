import { FiChevronUp } from 'react-icons/fi';
import { useScrollPosition } from '../../../hooks/useScrollPosition';
import './BackToTop.css';

export function BackToTop() {
  const { scrolled: visible } = useScrollPosition(300);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`back-to-top ${visible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
    >
      <FiChevronUp size={22} />
    </button>
  );
}
