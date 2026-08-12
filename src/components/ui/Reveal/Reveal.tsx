import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import './Reveal.css';

interface Props {
  children: React.ReactElement;
  width?: "fit-content" | "100%";
  height?: "fit-content" | "100%";
  className?: string;
  delay?: number;
  yOffset?: number;
}

/**
 * Entrada em fade + slide quando o elemento aparece na tela.
 *
 * Era `useInView` + `useAnimation` do framer-motion. A animação é sempre a
 * mesma (opacity + translateY), então CSS dá conta — e o framer deixa de ser
 * arrastado para toda página que revele qualquer coisa. Mesma API de antes.
 */
export const Reveal = ({ children, width = "fit-content", height = "fit-content", className = "", delay = 0, yOffset = 75 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const io = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (entry?.isIntersecting) {
        setIsVisible(true);
        io.disconnect(); // once: true
      }
    });

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style = {
    height,
    '--reveal-delay': `${0.25 + delay}s`,
    '--reveal-offset': `${yOffset}px`,
  } as CSSProperties;

  return (
    <div ref={ref} className={className} style={{ position: "relative", width, height, overflow: "visible" }}>
      <div className={`reveal-inner${isVisible ? ' is-visible' : ''}`} style={style}>
        {children}
      </div>
    </div>
  );
};
