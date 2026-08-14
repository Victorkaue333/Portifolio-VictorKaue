import { useTranslation } from 'react-i18next';
import {
    FiAward,
    FiBriefcase,
    FiDownload,
    FiGlobe,
    FiHome,
    FiLayers,
    FiMail,
    FiMoon,
    FiSun,
    FiUser,
} from 'react-icons/fi';
import { Link, NavLink } from 'react-router-dom';
import { navLinks } from '../../../data/social';
import { prefetchRoute } from '../../../routes';
import { useLanguage } from '../../../hooks/useLanguage';
import { useScrollPosition } from '../../../hooks/useScrollPosition';
import { useTheme } from '../../../theme/ThemeProvider';
import './Navbar.css';

const navIconByPath = {
  '/': FiHome,
  '/sobre': FiUser,
  '/projetos': FiBriefcase,
  '/servicos': FiLayers,
  '/certificados': FiAward,
  '/contato': FiMail,
} as const;

const navKeyByPath = {
  '/': 'home',
  '/sobre': 'about',
  '/projetos': 'projects',
  '/servicos': 'services',
  '/certificados': 'certificates',
  '/contato': 'contact',
} as const;

export function Navbar() {
  const { t } = useTranslation();
  const { scrolled } = useScrollPosition(60);
  const { lang, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="main-navbar" aria-label="Navegação principal">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" aria-label="Victor Kauê - Página inicial">
          <span className="logo-white">Victor</span>
          <span className="logo-orange"> Kauê</span>
        </Link>

        <div className="nav-menu-wrapper">
          <ul className="nav-menu">
            {navLinks.map((link) => {
              const Icon = navIconByPath[link.path as keyof typeof navIconByPath] || FiHome;
              const navKey = navKeyByPath[link.path as keyof typeof navKeyByPath] || 'home';
              const label = t(`nav.${navKey}`);

              return (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    end={link.path === '/'}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                    // Começa a baixar o chunk da rota no hover/foco, antes do
                    // clique — senão a espera pela rede vira tela de loader.
                    onMouseEnter={() => prefetchRoute(link.path)}
                    onFocus={() => prefetchRoute(link.path)}
                  >
                    <Icon size={15} aria-hidden="true" />
                    <span>{label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="navbar-actions">
          <button
            className="btn-theme"
            onClick={(e) => toggleTheme(e.currentTarget)}
            aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
          >
            {theme === 'dark' ? <FiSun size={16} aria-hidden="true" /> : <FiMoon size={16} aria-hidden="true" />}
          </button>

          <button className="btn-lang" onClick={toggleLanguage} aria-label="Trocar idioma / Change language">
            <FiGlobe size={14} aria-hidden="true" />
            {lang === 'pt' ? 'EN' : 'PT'}
          </button>

          <a
            href="/docs/Curriculo/Curriculo_Victor_Kaue.pdf"
            className="btn-cv"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('nav.downloadCV')}
          >
            <FiDownload size={14} />
            {t('nav.downloadCV')}
          </a>
        </div>
      </div>
    </nav>
  );
}