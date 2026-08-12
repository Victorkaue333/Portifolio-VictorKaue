import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import {
  FiArrowRight,
  FiCheckCircle,
  FiCode,
  FiCpu,
  FiDatabase,
  FiLayout,
  FiMessageCircle,
  FiPenTool,
  FiPlus,
  FiSearch,
  FiSend,
} from 'react-icons/fi';
import { Button } from '../../components/ui/Button/Button';
import { PageHero } from '../../components/ui/PageHero/PageHero';
import { Reveal } from '../../components/ui/Reveal/Reveal';
import { TechMarquee } from '../../components/ui/TechMarquee/TechMarquee';
import { useLanguage } from '../../hooks/useLanguage';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useSeo } from '../../hooks/useSeo';
import { testimonials } from '../../data/testimonials';
import './Servicos.css';

/** Etapas do processo — o número casa com as chaves `servicos.stepNTitle` / `stepNDesc`. */
const APPROACH_STEPS = [
  { n: 1, Icon: FiSearch },
  { n: 2, Icon: FiPenTool },
  { n: 3, Icon: FiCode },
  { n: 4, Icon: FiSend },
];

/** Seção "Como eu trabalho" — os passos deslizam na horizontal conforme a página rola. */
function ApproachHorizontal() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);

  const steps = APPROACH_STEPS.map(({ n, Icon }) => ({
    num: `0${n}`,
    Icon,
    title: t(`servicos.step${n}Title`),
    desc: t(`servicos.step${n}Desc`),
  }));

  // Mede quanto o track precisa deslizar (largura total - viewport visível).
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const calc = () => {
      const viewport = track.parentElement?.clientWidth ?? 0;
      setDistance(Math.max(0, track.scrollWidth - viewport));
    };
    calc();

    // Recalcula quando o track muda de tamanho (fontes, resize, i18n).
    const ro = new ResizeObserver(calc);
    ro.observe(track);
    if (track.parentElement) ro.observe(track.parentElement);
    window.addEventListener('resize', calc);
    window.addEventListener('load', calc);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', calc);
      window.removeEventListener('load', calc);
    };
  }, [t]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  // Etapa em foco = progresso do scroll mapeado nos passos (usado só para destaque visual).
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const index = Math.round(value * (steps.length - 1));
    setActive(Math.min(steps.length - 1, Math.max(0, index)));
  });

  return (
    <section
      ref={sectionRef}
      className="approach-pin"
      // Altura extra = distância horizontal, para o scroll vertical virar movimento lateral 1:1.
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="approach-sticky">
        <div className="container approach-head">
          <h2 className="section-title">{t('servicos.approachTitle')}</h2>
          <p className="section-subtitle">{t('servicos.approachSubtitle')}</p>
        </div>

        <div className="approach-viewport">
          <motion.div ref={trackRef} style={{ x }} className="approach-track">
            {steps.map((step, i) => {
              const Icon = step.Icon;
              return (
                <article key={step.num} className={`approach-panel ${i === active ? 'is-active' : ''}`}>
                  <header className="approach-panel-head">
                    <span className="approach-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span className="approach-num" aria-hidden="true">{step.num}</span>
                  </header>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                  <span className="approach-rule" aria-hidden="true" />
                </article>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** FAQ com acordeão. */
function Faq() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<number | null>(0);
  const items = [1, 2, 3, 4].map((n) => ({
    q: t(`servicos.faq${n}Q`),
    a: t(`servicos.faq${n}A`),
  }));

  return (
    <section className="services-faq content-section">
      <div className="container">
        <div className="section-header reveal-on-scroll">
          <h2 className="section-title">{t('servicos.faqTitle')}</h2>
        </div>
        <div className="faq-list">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{item.q}</span>
                  <FiPlus className="faq-icon" aria-hidden="true" />
                </button>
                <div className="faq-answer" role="region">
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Servicos() {
  const { t } = useTranslation();
  const { lang } = useLanguage();
  useScrollReveal();

  useSeo({
    title: t('seo.servicesTitle'),
    description: t('seo.servicesDesc'),
    path: '/servicos',
  });

  return (
    <main className="page-servicos">
      <section className="services-hero content-section">
        <div className="container">
          <PageHero
            titleMain={t('servicos.heroMain')}
            titleAccent={t('servicos.heroAccent')}
            subtitle={t('servicos.heroSubtitle')}
            icon={<FiDatabase size={22} />}
          />
        </div>

        <div className="container">
          <div className="services-grid">
            <Reveal delay={0.1}>
              <div className="service-card">
                <div className="service-icon">
                  <FiDatabase />
                </div>
                <h3>{t('servicos.card1Title')}</h3>
                <p>{t('servicos.card1Desc')}</p>
                <ul>
                  <li><FiCheckCircle /> {t('servicos.card1Item1')}</li>
                  <li><FiCheckCircle /> {t('servicos.card1Item2')}</li>
                  <li><FiCheckCircle /> {t('servicos.card1Item3')}</li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="service-card featured">
                <div className="service-icon">
                  <FiLayout />
                </div>
                <h3>{t('servicos.card2Title')}</h3>
                <p>{t('servicos.card2Desc')}</p>
                <ul>
                  <li><FiCheckCircle /> {t('servicos.card2Item1')}</li>
                  <li><FiCheckCircle /> {t('servicos.card2Item2')}</li>
                  <li><FiCheckCircle /> {t('servicos.card2Item3')}</li>
                </ul>
                <Button href="/contato" variant="primary">
                  {t('servicos.card2Cta')} <FiArrowRight />
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="service-card">
                <div className="service-icon">
                  <FiCpu />
                </div>
                <h3>{t('servicos.card3Title')}</h3>
                <p>{t('servicos.card3Desc')}</p>
                <ul>
                  <li><FiCheckCircle /> {t('servicos.card3Item1')}</li>
                  <li><FiCheckCircle /> {t('servicos.card3Item2')}</li>
                  <li><FiCheckCircle /> {t('servicos.card3Item3')}</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <ApproachHorizontal />

      {/* Faixa de tecnologias */}
      <section className="services-tech content-section">
        <div className="container">
          <div className="section-header reveal-on-scroll">
            <h2 className="section-title">{t('servicos.techTitle')}</h2>
            <p className="section-subtitle">{t('servicos.techSubtitle')}</p>
          </div>
        </div>
        <TechMarquee />
      </section>

      {/* Depoimentos */}
      <section className="services-testimonials content-section">
        <div className="container">
          <div className="section-header reveal-on-scroll">
            <h2 className="section-title">{t('servicos.testimonialsTitle')}</h2>
            <p className="section-subtitle">{t('servicos.testimonialsSubtitle')}</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.12}>
                <figure className="testimonial-card">
                  <blockquote>“{item.quote[lang]}”</blockquote>
                  <figcaption>
                    <span className="testimonial-avatar" aria-hidden="true">{item.initials}</span>
                    <span className="testimonial-meta">
                      <strong>{item.name}</strong>
                      <small>{item.role[lang]}</small>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Faq />

      {/* CTA final */}
      <section className="services-cta content-section">
        <div className="container">
          <div className="cta-panel reveal-on-scroll">
            <div className="cta-copy">
              <h2>{t('servicos.ctaTitle')}</h2>
              <p>{t('servicos.ctaDesc')}</p>
            </div>
            <Button href="/contato" variant="primary">
              <FiMessageCircle /> {t('servicos.ctaButton')}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
