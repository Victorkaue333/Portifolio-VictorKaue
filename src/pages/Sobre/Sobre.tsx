import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiBookOpen, FiBriefcase, FiCalendar, FiChevronRight, FiCode, FiMail, FiMapPin, FiTarget } from 'react-icons/fi';
import { FaLinkedin } from 'react-icons/fa6';
import { SiGithub } from 'react-icons/si';
import { Button } from '../../components/ui/Button/Button';
import { TechGlyph } from '../../components/ui/TechIcon/TechIcon';
import { TechMarquee } from '../../components/ui/TechMarquee/TechMarquee';
import { education } from '../../data/education';
import { experiences } from '../../data/experiences';
import { socialLinks } from '../../data/social';
import { useLanguage } from '../../hooks/useLanguage';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useSeo } from '../../hooks/useSeo';
import type { ExperienceRole } from '../../types';
import './Sobre.css';

/** Monograma (iniciais) para empresas sem logo. Ignora conectivos e sufixos após "—" ou parênteses. */
function companyInitials(name: string): string {
  const stop = new Set(['do', 'de', 'da', 'dos', 'das', 'e']);
  const clean = name.replace(/[—–-].*$/, '').replace(/\(.*?\)/g, '').trim();
  const words = clean.split(/\s+/).filter((w) => w && !stop.has(w.toLowerCase()));
  return (words.slice(0, 2).map((w) => w[0]).join('') || name[0] || '?').toUpperCase();
}

/** Corpo de um cargo: descrição + atividades + chips de skills. */
function ExperienceBody({ role }: { role: ExperienceRole }) {
  return (
    <>
      {role.description && <p className="li-exp-desc">{role.description}</p>}
      {role.activities && role.activities.length > 0 && (
        <ul className="li-exp-acts">
          {role.activities.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      )}
      {role.skills && role.skills.length > 0 && (
        <div className="li-exp-skills">
          {role.skills.map((s) => (
            <span className="li-exp-skill" key={s}>
              <TechGlyph name={s} size={13} className="li-exp-skill-icon" />
              {s}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

export default function Sobre() {
  const { t } = useTranslation();
  const { lang, setLanguage } = useLanguage();
  const [activeSection, setActiveSection] = useState('intro');
  const [githubStatsError, setGithubStatsError] = useState(false);
  useScrollReveal();

  useSeo({
    title: t('seo.aboutTitle'),
    description: t('seo.aboutDesc'),
    path: '/sobre',
  });

  const menuItems = [
    { id: 'intro', label: t('about.title'), icon: <FiTarget size={16} /> },
    { id: 'role', label: t('about.highlights.title'), icon: <FiBriefcase size={16} /> },
    { id: 'experience', label: 'Experiencia', icon: <FiBriefcase size={16} /> },
    { id: 'education', label: 'Formacao', icon: <FiBookOpen size={16} /> },
    { id: 'expertise', label: 'Expertise técnica', icon: <FiCode size={16} /> },
    { id: 'github', label: 'GitHub', icon: <SiGithub size={16} aria-hidden="true" /> },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  return (
    <main className="page-sobre">
      <div className="container">
        <div className="about-layout">
          <aside className="about-sidebar">
            <div className="sidebar-sticky">
              <div className="profile-card reveal-on-scroll">
                <div className="profile-image-container">
                  <div className="profile-glow" aria-hidden="true" />
                  <img src="/images/eu/victor.webp" alt="Victor Kauê" className="profile-photo" />
                </div>

                <h1 className="sidebar-name">Victor Kauê</h1>
                <h2 className="sidebar-role">Desenvolvedor Full Stack</h2>

                <div className="sidebar-pills">
                  <div className="sidebar-pill">
                    <FiMapPin size={14} />
                    <span>Itacuruba, PE - Brasil</span>
                  </div>
                </div>

                <div className="lang-toggle-container">
                  <button
                    className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                    onClick={() => setLanguage('en')}
                    aria-pressed={lang === 'en'}
                  >
                    English
                  </button>
                  <button
                    className={`lang-btn ${lang === 'pt' ? 'active' : ''}`}
                    onClick={() => setLanguage('pt')}
                    aria-pressed={lang === 'pt'}
                  >
                    Portugues
                  </button>
                </div>

                <nav className="sidebar-nav">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                      onClick={() => scrollToSection(item.id)}
                    >
                      <span className="nav-dot" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          <div className="about-main-content">
            <div className="content-header reveal-on-scroll">
              <a href="https://wa.me/5587981774951" target="_blank" rel="noopener noreferrer" className="header-cta">
                <FiCalendar size={16} />
                Agendar uma chamada
                <FiChevronRight size={16} />
              </a>
              <h2 className="main-title">Victor Kauê</h2>
              <h3 className="main-subtitle">Desenvolvedor Full Stack</h3>

              <div className="socials-list">
                {socialLinks.filter((s) => ['GitHub', 'LinkedIn', 'Email'].includes(s.name)).map((link) => (
                  <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="social-btn">
                    {link.name === 'GitHub' && <SiGithub size={16} aria-hidden="true" />}
                    {link.name === 'LinkedIn' && <FaLinkedin size={16} aria-hidden="true" />}
                    {link.name === 'Email' && <FiMail size={16} />}
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            <section id="intro" className="about-content-section reveal-on-scroll">
              <p className="intro-text">{t('about.intro')}</p>
            </section>

            <section id="role" className="about-content-section reveal-on-scroll">
              <h2 className="section-title">
                <FiTarget size={24} />
                {t('about.highlights.title')}
              </h2>
              <div className="diferenciais-grid">
                <div className="diferencial-card">
                  <h3>{t('about.highlights.backend')}</h3>
                  <p>{t('about.highlights.backendDesc')}</p>
                </div>
                <div className="diferencial-card">
                  <h3>{t('about.highlights.api')}</h3>
                  <p>{t('about.highlights.apiDesc')}</p>
                </div>
                <div className="diferencial-card">
                  <h3>{t('about.highlights.enterprise')}</h3>
                  <p>{t('about.highlights.enterpriseDesc')}</p>
                </div>
              </div>
            </section>

            <section id="experience" className="about-content-section">
              <h2 className="section-title reveal-on-scroll">
                <FiBriefcase size={24} />
                Experiência Profissional
              </h2>
              <div className="li-exp-list">
                {experiences.map((group) => {
                  const multi = group.roles.length > 1;
                  const primary = group.roles[0];
                  if (!primary) return null;
                  return (
                    <article className="li-exp-item reveal-on-scroll" key={group.id}>
                      <div className="li-exp-head">
                        <div className="li-exp-logo">
                          {group.logo ? (
                            <img src={group.logo} alt={group.company} loading="lazy" decoding="async" />
                          ) : (
                            <span className="li-exp-monogram">{companyInitials(group.company)}</span>
                          )}
                        </div>
                        <div className="li-exp-head-text">
                          {multi ? (
                            <>
                              <h3 className="li-exp-primary">{group.company}</h3>
                              <p className="li-exp-secondary">
                                {[group.employmentType, group.totalDuration].filter(Boolean).join(' · ')}
                              </p>
                              {group.location && <p className="li-exp-muted">{group.location}</p>}
                            </>
                          ) : (
                            (() => {
                              const r = primary;
                              const locLine = [r.location, r.workMode].filter(Boolean).join(' · ');
                              return (
                                <>
                                  <h3 className="li-exp-primary">{r.title}</h3>
                                  <p className="li-exp-secondary">
                                    {[group.company, r.employmentType].filter(Boolean).join(' · ')}
                                  </p>
                                  <p className="li-exp-muted">
                                    {[r.period, r.duration].filter(Boolean).join(' · ')}
                                  </p>
                                  {locLine && <p className="li-exp-muted">{locLine}</p>}
                                </>
                              );
                            })()
                          )}
                        </div>
                      </div>

                      {multi ? (
                        <div className="li-exp-roles">
                          {group.roles.map((r, ri) => (
                            <div className="li-exp-role" key={ri}>
                              <span className="li-exp-role-dot" />
                              <h4 className="li-exp-role-title">{r.title}</h4>
                              <p className="li-exp-muted">
                                {[r.period, r.duration].filter(Boolean).join(' · ')}
                              </p>
                              <ExperienceBody role={r} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="li-exp-body">
                          <ExperienceBody role={primary} />
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>

            <section id="education" className="about-content-section reveal-on-scroll">
              <h2 className="section-title">
                <FiBookOpen size={24} />
                Formações
              </h2>
              <div className="education-list">
                {education.map((edu) => (
                  <div className="education-item-row" key={edu.id}>
                    <div className="edu-icon"><FiBookOpen size={20} /></div>
                    <div className="edu-info">
                      <h3>{edu.course}</h3>
                      <p>{edu.institution} - {edu.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="expertise" className="about-content-section reveal-on-scroll">
              <h2 className="section-title">
                <FiCode size={24} />
                Expertise técnica
              </h2>
              <TechMarquee />
            </section>

            <section id="github" className="about-content-section reveal-on-scroll">
              <h2 className="section-title">
                <SiGithub size={24} aria-hidden="true" />
                GitHub Stats
              </h2>
              {!githubStatsError ? (
                <div className="github-stats-container">
                  <a href="https://github.com/Victorkaue333" target="_blank" rel="noopener noreferrer" className="github-card-link">
                    <img
                      src="https://github-readme-stats.vercel.app/api?username=Victorkaue333&show_icons=true&theme=tokyonight&hide_border=true&bg_color=0B1220&title_color=F59E0B&icon_color=F59E0B&text_color=F3F4F6"
                      alt="GitHub Stats"
                      className="github-img"
                      loading="lazy"
                      decoding="async"
                      onError={() => setGithubStatsError(true)}
                    />
                  </a>
                  <a href="https://github.com/Victorkaue333" target="_blank" rel="noopener noreferrer" className="github-card-link">
                    <img
                      src="https://github-readme-stats.vercel.app/api/top-langs/?username=Victorkaue333&layout=compact&theme=tokyonight&hide_border=true&bg_color=0B1220&title_color=F59E0B&text_color=F3F4F6"
                      alt="Top Languages"
                      className="github-img"
                      loading="lazy"
                      decoding="async"
                      onError={() => setGithubStatsError(true)}
                    />
                  </a>
                </div>
              ) : (
                <div className="github-fallback-card">
                  <p>Confira minhas atividades diretamente no meu perfil:</p>
                  <Button href="https://github.com/Victorkaue333" variant="outline" external>
                    <SiGithub size={18} aria-hidden="true" />
                    Ver GitHub
                  </Button>
                </div>
              )}
            </section>

            <div className="view-more-action">
              <Button href="/projetos" variant="primary">
                Ver meus projetos
                <FiChevronRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
