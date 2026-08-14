import { useEffect, useRef, useState } from "react";

interface CounterProps {
  value: number;
  direction?: "up" | "down";
  prefix?: string;
  suffix?: string;
}

const DURATION_MS = 1200;

/** Desaceleração no fim, parecida com a mola que o framer-motion usava. */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Número que conta até o valor quando entra na tela.
 *
 * Era `useSpring` + `useMotionValue` + `useInView` do framer-motion — 47 kB
 * comprimidos só para animar um inteiro na Home. Aqui é IntersectionObserver
 * + um rAF que para sozinho ao chegar no fim.
 */
export function Counter({
  value,
  direction = "up",
  prefix = "",
  suffix = "",
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = direction === "down" ? value : 0;
  const to = direction === "down" ? 0 : value;
  const [display, setDisplay] = useState(from);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(to);
      return;
    }

    let raf = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const progress = Math.min(1, (now - start) / DURATION_MS);
      setDisplay(Math.floor(from + (to - from) * easeOut(progress)));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry?.isIntersecting) return;
        io.disconnect(); // once: true
        raf = requestAnimationFrame(tick);
      },
      { rootMargin: "-100px" }
    );

    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [from, to]);

  return (
    <span ref={ref} style={{ display: "inline-block" }}>
      {`${prefix}${display}${suffix}`}
    </span>
  );
}
