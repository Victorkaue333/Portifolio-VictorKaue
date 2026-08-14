import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Layout/Navbar/Navbar';
import { Footer } from './components/Layout/Footer/Footer';
import { BackToTop } from './components/Layout/BackToTop/BackToTop';
import ScrollToTop from './components/Layout/ScrollToTop/ScrollToTop';
import { MobileNavbar } from './components/Layout/Navbar/MobileNavbar';
import { FirstVisitLoader } from './components/Layout/FirstVisitLoader/FirstVisitLoader';
import { NavigationLoader } from './components/Layout/NavigationLoader/NavigationLoader';
import {
  Home,
  Sobre,
  Projetos,
  ProjetoDetalhe,
  Servicos,
  Certificados,
  Contato,
  NaoEncontrado,
} from './routes';
import './App.css';

function PageLoader() {
  return (
    <div className="page-loader-wrapper" aria-hidden="true">
      <div className="nav-loader-arc" />
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <NavigationLoader />
      {/* A transição de página era `AnimatePresence mode="wait"` + `motion.div`.
          Isso trazia o framer-motion para o bundle inicial de toda rota e, com
          `mode="wait"`, ainda segurava a página nova até a antiga terminar de
          sair — atraso somado ao download do chunk lazy. Trocar a chave
          remonta o wrapper e o CSS toca `page-enter` sozinho. */}
      <div key={location.pathname} className="page-motion-wrapper">
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/projetos" element={<Projetos />} />
            <Route path="/projetos/:id" element={<ProjetoDetalhe />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/certificados" element={<Certificados />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="*" element={<NaoEncontrado />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <FirstVisitLoader />
      <ScrollToTop />
      <Navbar />
      <AppRoutes />
      <Footer />
      <MobileNavbar />
      <BackToTop />
    </BrowserRouter>
  );
}
