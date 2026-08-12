import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit';
  external?: boolean;
}

/**
 * O hover/tap era feito com `motion` do framer-motion. Como o Button.css já
 * tinha as mesmas transições em CSS, o JS só duplicava trabalho — e arrastava
 * o framer para dentro de qualquer página que use um botão. Agora é CSS puro
 * (ver `.btn:hover` / `.btn:active`).
 */
export function Button({
  variant = 'primary',
  href,
  onClick,
  children,
  className = '',
  target,
  rel,
  type = 'button',
  external
}: ButtonProps) {
  const cls = `btn btn-${variant} ${className}`.trim();

  if (href) {
    const isExternal = external || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
    const isInternalRoute = !isExternal && href.startsWith('/');

    if (isInternalRoute) {
      return (
        <Link to={href} className={cls} target={target} rel={rel}>
          {children}
        </Link>
      );
    }

    const finalTarget = isExternal ? '_blank' : target;
    const finalRel = isExternal ? 'noopener noreferrer' : rel;

    return (
      <a href={href} className={cls} target={finalTarget} rel={finalRel}>
        {children}
      </a>
    );
  }

  return (
    <button className={cls} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
