import { Certificate } from '../types';

export const certificates: Certificate[] = [
  {
    id: 'wp-oficina',
    title: 'Desenvolvimento de sites com WordPress',
    issuer: 'Oficina Workshop',
    category: 'programacao',
    pdf: '/Certificados/pdfs/Oficina_Workshop - Oficina_ Desenvolvimento de sites com Wordpress.pdf',
    image: '/Certificados/pdfs/fotos/Oficina_Workshop - Oficina_ Desenvolvimento de sites com Wordpress.webp'
  },
  {
    id: 'canva-oficina',
    title: 'Design com Canva',
    issuer: 'Oficina Workshop',
    category: 'design',
    pdf: '/Certificados/pdfs/Oficina_Workshop - Oficina_ Design com Canva.pdf',
    image: '/Certificados/pdfs/fotos/Oficina_Workshop - Oficina_ Design com Canva.webp'
  },
  {
    id: 'jogos-minicurso',
    title: 'Aprendendo a Programar Jogos',
    issuer: 'Minicurso / Workshop',
    category: 'programacao',
    pdf: '/Certificados/pdfs/Workshop - Minicurso - Aprendendo a Programar Jogos.pdf',
    image: '/Certificados/pdfs/fotos/Workshop - Minicurso - Aprendendo a Programar Jogos.webp'
  },
  {
    id: 'pm-canvas-workshop',
    title: 'Planejamento de Projetos com PM Canvas',
    issuer: 'Workshop',
    category: 'gestao',
    pdf: '/Certificados/pdfs/Workshop - Planejamento de Projetos com PM Canvas.pdf',
    image: '/Certificados/pdfs/fotos/Workshop - Planejamento de Projetos com PM Canvas.webp'
  }
];

export const certificateCategories = [
  { id: 'todos', label: 'Todos' },
  { id: 'programacao', label: 'Programação' },
  { id: 'design', label: 'Design & UI' },
  { id: 'gestao', label: 'Gestão & Metodologias' }
];
