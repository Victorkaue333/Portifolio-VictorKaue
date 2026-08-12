import {
  FiArrowRight,
  FiMail,
  FiDatabase,
  FiCpu,
  FiActivity,
  FiZap,
  FiLayout,
  FiTrendingUp,
  FiChevronDown
} from 'react-icons/fi';
import { FaLinkedin } from 'react-icons/fa6';
import { SiGithub } from 'react-icons/si';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { featuredProjects } from '../../data/projects';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useSeo } from '../../hooks/useSeo';
import { Button } from '../../components/ui/Button/Button';
import { Reveal } from '../../components/ui/Reveal/Reveal';
import { ProjectCard } from '../../components/ui/ProjectCard/ProjectCard';
import { Counter } from '../../components/ui/Counter/Counter';
import { TechMarquee } from '../../components/ui/TechMarquee/TechMarquee';
import { FloatingLines } from '../../components/ui/FloatingLines/FloatingLines';
import './Home.css';

export default function Home() {
  const { t } = useTranslation();
  useScrollReveal();

  useSeo({
    title: t('seo.homeTitle'),
    description: t('seo.homeDesc'),
    path: '/',
  });

  const results = [
    { value: 30, suffix: '%', label: t('home.result1') },
    { value: 25, suffix: '+', label: t('home.result2') },
    { value: 10, suffix: '+', label: t('home.result3') },
  ];

  const services = [
    { id: 'backend', icon: <FiDatabase size={24} />, title: t('about.highlights.backend'), desc: t('about.highlights.backendDesc') },
    { id: 'api', icon: <FiCpu size={24} />, title: t('about.highlights.api'), desc: t('about.highlights.apiDesc') },
    { id: 'fullstack', icon: <FiLayout size={24} />, title: t('about.highlights.enterprise'), desc: t('about.highlights.enterpriseDesc') }
  ];

  return (
    <main className="home">

      {/* ========== HERO SECTION (PRO MAX) ========== */}
      <section id="inicio" className="hero">
        <FloatingLines />
        <div className="container hero-container">
          <div className="hero-content">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="hero-title-main"
            >
              <span className="title-white">{t('hero.role')}</span>
              <span className="title-gray">{t('hero.tech')}</span>
            </motion.h1>

            <Reveal delay={0.3}>
              <p className="hero-description">
                {t('hero.description')}
              </p>
            </Reveal>

            <div className="hero-actions">
              <Reveal delay={0.5}>
                <Button href="/sobre" variant="primary">
                  {t('hero.cta')}
                  <FiArrowRight size={18} />
                </Button>
              </Reveal>
              <Reveal delay={0.6}>
                <Button href="/projetos" variant="outline">
                  {t('hero.cta2')}
                </Button>
              </Reveal>
              <Reveal delay={0.7}>
                <div className="hero-socials">
                  <a href="https://github.com/Victorkaue333" target="_blank" rel="noopener noreferrer" className="social-icon github" aria-label="GitHub"><SiGithub size={20} /></a>
                  <a href="https://linkedin.com/in/victorkaue" target="_blank" rel="noopener noreferrer" className="social-icon linkedin" aria-label="LinkedIn"><FaLinkedin size={20} /></a>
                  <a href="mailto:kaue.alves.pg@gmail.com" className="social-icon email" aria-label="Email"><FiMail size={20} /></a>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="hero-visual">
            <div className="photo-container reveal-on-scroll">
              <div className="photo-ring" />
              <div className="photo-ring inner" />
              <div className="glass-overlay" />
              <img src="/images/eu/victorkaue.webp" alt="Victor Kauê" className="hero-image" width={1024} height={1536} fetchPriority="high" />
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <motion.button
          type="button"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="scroll-indicator-wrapper"
          aria-label="Rolar para a próxima seção"
          onClick={() => document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <div className="scroll-mouse">
            <div className="scroll-dot" />
          </div>
          <FiChevronDown className="scroll-arrow" />
        </motion.button>
      </section>

      {/* ========== RESULTS STRIP (PRO MAX) ========== */}
      <section className="results-strip">
        <div className="container">
          <div className="results-inner">
            <div className="results-badge">
              <FiTrendingUp size={16} /> {t('home.impactTitle')}
            </div>
            <div className="results-grid">
              {results.map((res, i) => (
                <Reveal key={i} delay={i * 0.1} yOffset={20}>
                  <div className="result-item">
                    <span className="result-value">
                      <Counter value={res.value} suffix={res.suffix} />
                    </span>
                    <span className="result-label">{res.label}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TechMarquee />

      {/* ========== SERVICES (PRO MAX) ========== */}
      <section id="servicos" className="home-services">
        <div className="container">
          <div className="section-header reveal-on-scroll">
            <h2 className="section-title"><FiActivity /> {t('about.highlights.title')}</h2>
            <p className="section-subtitle">{t('home.servicesSubtitle')}</p>
          </div>

          <div className="services-grid">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={i * 0.2} width="100%" height="100%">
                <div className="service-pro-card">
                  <div className="service-icon-box">{service.icon}</div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PROJECTS (PRO MAX) ========== */}
      <section id="projetos" className="home-projects">
        <div className="container">
          <div className="section-header reveal-on-scroll">
            <div className="header-top">
              <h2 className="section-title"><FiZap /> {t('home.featuredTitle')}</h2>
              <Button href="/projetos" variant="ghost">{t('common.viewAll')} <FiArrowRight size={18} /></Button>
            </div>
            <p className="section-subtitle">{t('home.featuredSubtitle')}</p>
          </div>

          <div className="projects-marquee">
            <div className="projects-marquee-track">
              {[...featuredProjects, ...featuredProjects].map((project, i) => (
                <div key={`${project.id}-${i}`} className="projects-marquee-item">
                  <ProjectCard project={project} withReveal={false} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
