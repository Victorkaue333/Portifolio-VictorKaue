import React, { useEffect, useRef } from 'react';

/**
 * Linhas onduladas animadas com brilho (fundo). Reescrito de three.js/R3F
 * para Canvas 2D — mesmo visual, sem o bundle de ~1 MB do WebGL.
 * Respeita prefers-reduced-motion, pausa quando a aba fica oculta e também
 * quando o Hero sai da tela.
 */
const LINE_COLOR = '255, 122, 0'; // laranja da marca (rgb)

export const FloatingLines: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    let width = 0;
    let height = 0;
    // mouse normalizado [0,1], origem no canto inferior-esquerdo (como no shader)
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    let raf = 0;
    let resizeRaf = 0;
    let visible = true; // Hero na tela
    let running = false;
    let startTime: number | null = null;

    const resize = () => {
      // Cap no DPR: em telas 3x o custo de preenchimento triplica sem ganho visível.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // O evento de resize dispara em rajada; coalesce num único quadro.
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        resize();
        if (!running) drawFrame(0); // mantém o quadro estático correto
      });
    };

    const onPointerMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1 - e.clientY / window.innerHeight;
    };

    const drawFrame = (elapsed: number) => {
      ctx.clearRect(0, 0, width, height);
      const aspect = width / Math.max(height, 1);
      const isMobile = width <= 768;
      const maxLines = isMobile ? 6 : 10;
      const verticalScale = isMobile ? 0.18 : 0.12;
      const coreWidth = isMobile ? 1 : 1.4;

      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const step = Math.max(4, Math.round(width / 220));

      for (let i = 1; i <= maxLines; i++) {
        const t = elapsed * 0.15 + i * 1.5;
        const offset = (i - maxLines * 0.5) * verticalScale;
        const alpha = Math.min(0.5, 0.55 / i);

        // A geometria é calculada uma vez e reaproveitada nas duas passadas.
        const path = new Path2D();
        for (let px = 0; px <= width; px += step) {
          const stx = px / width;
          const posx = stx * aspect;
          let y = 0.5 + Math.sin(posx * (0.4 + i * 0.05) + t) * 0.2;
          y += Math.sin(posx * 2.0 - t * 0.5) * 0.08;

          const lineY = y + offset;
          const dMouse = Math.hypot(stx - mouse.x, lineY - mouse.y);
          const mouseEffect = smoothstep(0.5, 0.0, dMouse);
          const bend = Math.sin(stx * 2.0 + elapsed) * mouseEffect * 0.15;

          const yNorm = lineY + bend;
          const pyPixel = (1 - yNorm) * height;
          if (px === 0) path.moveTo(px, pyPixel);
          else path.lineTo(px, pyPixel);
        }

        // Brilho por sobreposição em vez de `shadowBlur`: o blur gaussiano do
        // Canvas 2D roda na CPU e era o gargalo do Hero. Duas passadas de
        // espessura diferente dão a mesma queda suave por uma fração do custo.
        ctx.strokeStyle = `rgba(${LINE_COLOR}, ${alpha * 0.22})`;
        ctx.lineWidth = coreWidth * 5;
        ctx.stroke(path);

        ctx.strokeStyle = `rgba(${LINE_COLOR}, ${alpha})`;
        ctx.lineWidth = coreWidth;
        ctx.stroke(path);
      }
    };

    const loop = (now: number) => {
      if (!running) return;
      if (startTime === null) startTime = now;
      drawFrame((now - startTime) / 1000);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const sync = () => {
      if (visible && !document.hidden) start();
      else stop();
    };

    const onVisibility = sync;

    // Hero fora da tela = nenhum quadro. Antes o loop rodava a página inteira.
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    resize();
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    if (!reduceMotion) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }

    if (reduceMotion) {
      drawFrame(0); // um quadro estático
    } else {
      start();
    }

    return () => {
      stop();
      cancelAnimationFrame(resizeRaf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="floating-lines-container"
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
